import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import {
  listCountriesRoute,
  searchCountriesRoute,
  getCountryRoute,
} from "./routes/countries/route";
import {
  checkVisaRoute,
  getVisaRuleRoute,
} from "./routes/visa/check-route";
import {
  createTripRoute,
  listTripsRoute,
  getTripRoute,
  deleteTripRoute,
} from "./routes/trips/route";
import {
  syncCountriesRoute,
  ingestVisaRuleRoute,
  ingestMultipleRoute,
} from "./routes/admin/sync-route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  countries: createTRPCRouter({
    list: listCountriesRoute,
    search: searchCountriesRoute,
    get: getCountryRoute,
  }),
  visa: createTRPCRouter({
    check: checkVisaRoute,
    getRule: getVisaRuleRoute,
  }),
  trips: createTRPCRouter({
    create: createTripRoute,
    list: listTripsRoute,
    get: getTripRoute,
    delete: deleteTripRoute,
  }),
  admin: createTRPCRouter({
    syncCountries: syncCountriesRoute,
    ingestVisaRule: ingestVisaRuleRoute,
    ingestMultiple: ingestMultipleRoute,
  }),
});

export type AppRouter = typeof appRouter;