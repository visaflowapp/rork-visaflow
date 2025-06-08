import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import getProfileRoute from "./routes/profile/get/route";
import updateProfileRoute from "./routes/profile/update/route";
import createProfileRoute from "./routes/profile/create/route";
import listVisasRoute from "./routes/visas/list/route";
import listAllVisasRoute from "./routes/visas/listAll/route";
import createVisaRoute from "./routes/visas/create/route";
import deleteVisaRoute from "./routes/visas/delete/route";
import listAlertsRoute from "./routes/alerts/list/route";
import markAlertReadRoute from "./routes/alerts/markRead/route";
import dismissAlertRoute from "./routes/alerts/dismiss/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  profile: createTRPCRouter({
    get: getProfileRoute,
    update: updateProfileRoute,
    create: createProfileRoute,
  }),
  visas: createTRPCRouter({
    list: listVisasRoute,
    listAll: listAllVisasRoute,
    create: createVisaRoute,
    delete: deleteVisaRoute,
  }),
  alerts: createTRPCRouter({
    list: listAlertsRoute,
    markRead: markAlertReadRoute,
    dismiss: dismissAlertRoute,
  }),
});

export type AppRouter = typeof appRouter;