import express, { Request, Response } from "express";
import { validateAndCreateUser, validateVehicles } from "./utils";

const applicationRouter = express.Router();

applicationRouter.post("/", async (req: Request, res: Response) => {
  const {
    body: { user, vehicles },
  } = req; // get the info for applcaition creation. // { user, vehicles: vehicle[] }

  console.log({ user, vehicles });

  // wrap all logic in 1 transaction to not bother with incorrect data in db after
  let returnee: string = "";
  await req.prisma.$transaction(async (tx) => {
    const dbUser = await validateAndCreateUser(user, tx);
    const validatedVehicles = validateVehicles(vehicles);
    const newApplication = await tx.application.create({
      data: {
        user_id: dbUser.user_id,
      },
    });
    // create and attach vehicles to the application
    await Promise.all(
      validatedVehicles.map(async (vehicle) => {
        return tx.vehicle.create({
          data: {
            make: vehicle.make,
            model: vehicle.model,
            vin: vehicle.vin,
            year: vehicle.year,
            application_id: newApplication.application_id,
          },
        });
      })
    );
    returnee = `${req.clientInfo.baseUrl}/application/${newApplication.application_id}`;
  });

  // construct the url and return it.
  return res.json({
    url: returnee,
  });
});

applicationRouter.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    throw new Error("wrong id format");
  }

  const application = await req.prisma.application.findFirst({
    where: {
      application_id: id,
    },
    include: {
      user: true,
      vehicle: true,
    },
  });

  if (!application) {
    res.status(404).send("Application with such id is not found");
  }
  res.json(application);
});

applicationRouter.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const applicationId = Number(id);
  if (isNaN(applicationId)) {
    throw new Error("incorrect application id");
  }

  const { vehicles } = req.body;
  const validatedVehicles = validateVehicles(vehicles);
  const updatee = await Promise.all(
    validatedVehicles.map(async (vehicle) => {
      // update vehicle
      return await req.prisma.vehicle.update({
        where: {
          vin: vehicle.vin,
        },
        data: {
          ...vehicle,
        },
      });
    })
  );
  res.json({ vehicles: updatee });
});

applicationRouter.post("/price", (req: Request, res: Response) => {
  const minPrice = 37;
  const maxPrice = 504;
  const price = Math.random() * (maxPrice - minPrice) + minPrice;
  res.send({ price: Math.round(price * 100) / 100 });
});

export default applicationRouter;
