import type { VisaRule } from '../../models/visa-rule';
import type { UserTrip, TripStatus } from '../../models/user-trip';

export interface ComplianceCheck {
  status: TripStatus;
  passportValid: boolean;
  timeToApply: number | null;
  applyByDate: string | null;
  warnings: string[];
  errors: string[];
  nextActionDate: string | null;
  complianceNotes: string;
}

export interface ReminderSchedule {
  tripId: string;
  reminders: Reminder[];
}

export interface Reminder {
  date: string;
  daysBeforeTrip: number;
  type: 'passport_check' | 'visa_apply' | 'final_check' | 'urgent';
  message: string;
}

export class VisaCheckerService {
  private readonly BUFFER_DAYS = 7;
  private readonly REMINDER_INTERVALS = [30, 14, 7, 3, 1];

  private parseDate(dateString: string): Date {
    return new Date(dateString);
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  private addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  private daysBetween(date1: Date, date2: Date): number {
    const diffTime = date2.getTime() - date1.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  checkPassportValidity(
    passportExpiryDate: string | null,
    tripStartDate: string,
    requiredMonths: number | null
  ): { valid: boolean; message: string | null } {
    if (!passportExpiryDate) {
      return {
        valid: false,
        message: 'Passport expiry date not provided',
      };
    }

    if (!requiredMonths) {
      return { valid: true, message: null };
    }

    const expiryDate = this.parseDate(passportExpiryDate);
    const startDate = this.parseDate(tripStartDate);
    const requiredValidUntil = this.addMonths(startDate, requiredMonths);

    if (expiryDate < requiredValidUntil) {
      return {
        valid: false,
        message: `Passport must be valid until ${this.formatDate(requiredValidUntil)} (${requiredMonths} months from entry)`,
      };
    }

    return { valid: true, message: null };
  }

  calculateApplyByDate(
    tripStartDate: string,
    processingTimeDays: number | null
  ): { applyByDate: string | null; timeToApply: number | null } {
    if (!processingTimeDays) {
      return { applyByDate: null, timeToApply: null };
    }

    const today = new Date();
    const startDate = this.parseDate(tripStartDate);
    const totalLeadTime = processingTimeDays + this.BUFFER_DAYS;
    const applyByDate = this.addDays(startDate, -totalLeadTime);
    const timeToApply = this.daysBetween(today, applyByDate);

    return {
      applyByDate: this.formatDate(applyByDate),
      timeToApply,
    };
  }

  performComplianceCheck(
    trip: UserTrip,
    rule: VisaRule
  ): ComplianceCheck {
    console.log(`[VisaCheckerService] Checking compliance for trip ${trip.id}`);

    const warnings: string[] = [];
    const errors: string[] = [];
    const today = new Date();
    const startDate = this.parseDate(trip.start_date);
    const daysUntilTrip = this.daysBetween(today, startDate);

    const passportCheck = this.checkPassportValidity(
      trip.passport_expiry_date,
      trip.start_date,
      rule.passport_validity_requirement_months
    );

    if (!passportCheck.valid && passportCheck.message) {
      errors.push(passportCheck.message);
    }

    const { applyByDate, timeToApply } = this.calculateApplyByDate(
      trip.start_date,
      rule.processing_time_days
    );

    if (rule.visa_type === 'evisa' || rule.visa_type === 'embassy_required') {
      if (applyByDate && timeToApply !== null) {
        if (timeToApply < 0) {
          errors.push(
            `Application deadline passed! Should have applied by ${applyByDate}`
          );
        } else if (timeToApply <= 3) {
          warnings.push(
            `Urgent: Apply immediately! Deadline is ${applyByDate} (${timeToApply} days left)`
          );
        } else if (timeToApply <= 7) {
          warnings.push(
            `Apply soon! Recommended deadline: ${applyByDate} (${timeToApply} days left)`
          );
        }
      }
    }

    if (rule.visa_type === 'visa_free' && daysUntilTrip <= 7) {
      warnings.push('Trip starting soon. Verify passport and document requirements.');
    }

    let status: TripStatus = 'ok';
    let nextActionDate: string | null = null;

    if (errors.length > 0) {
      status = 'action_required';
      nextActionDate = this.formatDate(today);
    } else if (warnings.length > 0) {
      status = 'action_required';
      if (applyByDate) {
        nextActionDate = applyByDate;
      } else {
        nextActionDate = this.formatDate(this.addDays(today, 7));
      }
    } else {
      if (applyByDate && timeToApply !== null && timeToApply <= 30) {
        status = 'action_required';
        nextActionDate = applyByDate;
      }
    }

    const complianceNotes = [
      ...errors.map(e => `ERROR: ${e}`),
      ...warnings.map(w => `WARNING: ${w}`),
    ].join(' | ');

    console.log(`[VisaCheckerService] Compliance check complete:`, {
      status,
      errors: errors.length,
      warnings: warnings.length,
    });

    return {
      status,
      passportValid: passportCheck.valid,
      timeToApply,
      applyByDate,
      warnings,
      errors,
      nextActionDate,
      complianceNotes: complianceNotes || 'All requirements met',
    };
  }

  generateReminderSchedule(
    trip: UserTrip,
    rule: VisaRule
  ): ReminderSchedule {
    console.log(`[VisaCheckerService] Generating reminders for trip ${trip.id}`);

    const reminders: Reminder[] = [];
    const today = new Date();
    const startDate = this.parseDate(trip.start_date);

    if (rule.visa_type === 'visa_free') {
      reminders.push({
        date: this.formatDate(this.addDays(startDate, -7)),
        daysBeforeTrip: 7,
        type: 'final_check',
        message: `Trip to ${trip.destination_iso2} in 7 days. Verify passport validity and document checklist.`,
      });

      reminders.push({
        date: this.formatDate(this.addDays(startDate, -1)),
        daysBeforeTrip: 1,
        type: 'final_check',
        message: `Trip to ${trip.destination_iso2} tomorrow. Ensure all documents are ready.`,
      });
    }

    if (rule.visa_type === 'evisa' || rule.visa_type === 'embassy_required') {
      const { applyByDate, timeToApply } = this.calculateApplyByDate(
        trip.start_date,
        rule.processing_time_days
      );

      if (applyByDate && timeToApply !== null) {
        const applyDate = this.parseDate(applyByDate);

        for (const interval of this.REMINDER_INTERVALS) {
          const reminderDate = this.addDays(applyDate, -interval);
          if (reminderDate > today) {
            const type = interval <= 3 ? 'urgent' : 'visa_apply';
            reminders.push({
              date: this.formatDate(reminderDate),
              daysBeforeTrip: this.daysBetween(reminderDate, startDate),
              type,
              message: `${interval} days until visa application deadline (${applyByDate}) for ${trip.destination_iso2} trip.`,
            });
          }
        }

        reminders.push({
          date: this.formatDate(this.addDays(startDate, -3)),
          daysBeforeTrip: 3,
          type: 'final_check',
          message: `Trip in 3 days. Verify visa approval and print documents.`,
        });
      }
    }

    if (trip.passport_expiry_date) {
      const passportCheck = this.checkPassportValidity(
        trip.passport_expiry_date,
        trip.start_date,
        rule.passport_validity_requirement_months
      );

      if (!passportCheck.valid) {
        reminders.push({
          date: this.formatDate(today),
          daysBeforeTrip: this.daysBetween(today, startDate),
          type: 'urgent',
          message: `URGENT: ${passportCheck.message}`,
        });
      }
    }

    reminders.sort((a, b) => a.date.localeCompare(b.date));

    console.log(`[VisaCheckerService] Generated ${reminders.length} reminders`);

    return {
      tripId: trip.id,
      reminders,
    };
  }
}

let cachedService: VisaCheckerService | null = null;

export function getVisaCheckerService(): VisaCheckerService {
  if (!cachedService) {
    cachedService = new VisaCheckerService();
  }
  return cachedService;
}
