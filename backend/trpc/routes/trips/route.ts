import { publicProcedure } from '../../create-context';
import { UserTripModel } from '../../../models/user-trip';
import { VisaRuleModel } from '../../../models/visa-rule';
import { getVisaIngestService } from '../../../services/visa-ingest/ingestion';
import { getVisaCheckerService } from '../../../services/visa-checker/checker';
import { z } from 'zod';

export const createTripRoute = publicProcedure
  .input(z.object({
    userId: z.string(),
    citizenship: z.string().length(2),
    destination: z.string().length(2),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    passportExpiry: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  }))
  .mutation(async ({ input }) => {
    console.log('[createTripRoute] Creating trip:', input);
    
    try {
      let visaRule = await VisaRuleModel.findByPair(
        input.citizenship,
        input.destination
      );

      if (!visaRule) {
        console.log('[createTripRoute] Rule not found, ingesting...');
        const ingestService = getVisaIngestService();
        await ingestService.ingestVisaRule(input.citizenship, input.destination);
        
        visaRule = await VisaRuleModel.findByPair(
          input.citizenship,
          input.destination
        );
      }

      if (!visaRule) {
        throw new Error('Failed to retrieve visa requirements');
      }

      const trip = await UserTripModel.create({
        user_id: input.userId,
        citizenship_iso2: input.citizenship,
        destination_iso2: input.destination,
        start_date: input.startDate,
        end_date: input.endDate,
        visa_rule_id: visaRule.id,
        passport_expiry_date: input.passportExpiry || null,
        status: 'unknown',
      });

      const checkerService = getVisaCheckerService();
      const compliance = checkerService.performComplianceCheck(trip, visaRule);
      
      const updatedTrip = await UserTripModel.update(trip.id, {
        status: compliance.status,
        next_action_date: compliance.nextActionDate,
        compliance_notes: compliance.complianceNotes,
      });

      const reminders = checkerService.generateReminderSchedule(updatedTrip, visaRule);

      return {
        success: true,
        data: {
          trip: updatedTrip,
          compliance,
          reminders,
        },
      };
    } catch (error) {
      console.error('[createTripRoute] Error:', error);
      throw error;
    }
  });

export const listTripsRoute = publicProcedure
  .input(z.object({
    userId: z.string(),
  }))
  .query(async ({ input }) => {
    console.log('[listTripsRoute] Fetching trips for user:', input.userId);
    
    try {
      const trips = await UserTripModel.findByUserId(input.userId);

      return {
        success: true,
        data: trips,
        count: trips.length,
      };
    } catch (error) {
      console.error('[listTripsRoute] Error:', error);
      throw error;
    }
  });

export const getTripRoute = publicProcedure
  .input(z.object({
    tripId: z.string(),
  }))
  .query(async ({ input }) => {
    console.log('[getTripRoute] Fetching trip:', input.tripId);
    
    try {
      const trip = await UserTripModel.findById(input.tripId);

      if (!trip) {
        throw new Error('Trip not found');
      }

      return {
        success: true,
        data: trip,
      };
    } catch (error) {
      console.error('[getTripRoute] Error:', error);
      throw error;
    }
  });

export const deleteTripRoute = publicProcedure
  .input(z.object({
    tripId: z.string(),
  }))
  .mutation(async ({ input }) => {
    console.log('[deleteTripRoute] Deleting trip:', input.tripId);
    
    try {
      await UserTripModel.delete(input.tripId);

      return {
        success: true,
        message: 'Trip deleted successfully',
      };
    } catch (error) {
      console.error('[deleteTripRoute] Error:', error);
      throw error;
    }
  });
