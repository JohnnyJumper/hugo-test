import { Prisma, PrismaClient, user, vehicle } from "@prisma/client";

export type PrismaTransaction = Omit<
  PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use"
>;

export const isOlderThanSixteen = (userDOB: Date): boolean => {
  const today = new Date(Date.now());
  const age = today.getFullYear() - userDOB.getFullYear();
  const monthDiff = today.getMonth() - userDOB.getMonth();
  if (monthDiff < 0 || today.getDate() < userDOB.getDate()) {
    // this makes sure to cover cases like that
    // today: 01-01-2023
    // dob: 01-02-2007 (1 day to 16 years old)
    return age - 1 > 16;
  }
  return age > 16;
};

export const isNumeric = (str: string): boolean => {
  return /^\d+$/.test(str);
};

const isUser = (obj: any): obj is Omit<user, "user_id"> => {
  return (
    !!obj &&
    !!obj.first_name &&
    !!obj.last_name &&
    !!obj.dob &&
    !!obj.address_street &&
    !!obj.address_city &&
    !!obj.address_state &&
    !!obj.address_zipcode
  );
};

const isVehicles = (
  obj: any
): obj is Omit<vehicle, "vehicle_id" | "application_id">[] => {
  if (!obj || !Array.isArray(obj)) {
    return false;
  }
  if (obj.length > 0) {
    obj.map((entry) => {
      if (!isVehicle(entry)) {
        return false;
      }
    });
  }
  return true;
};

const isVehicle = (
  obj: any
): obj is Omit<vehicle, "vehicle_id" | "application_id"> => {
  return !!obj && !!obj.vin && !!obj.year && !!obj.make && !!obj.model;
};

export const validateAndCreateUser = async (
  user: any,
  tx: PrismaTransaction
): Promise<user> => {
  if (!isUser(user)) {
    throw new Error("invalid user data");
  }
  const userDOB = new Date(user.dob);

  if (isNaN(userDOB.getTime())) {
    throw new Error("not valid date");
  }

  if (!isOlderThanSixteen(userDOB)) {
    throw new Error("too young to have insurance");
  }

  if (!isNumeric(user.address_zipcode)) {
    throw new Error("invalid zipcode");
  }
  // at this point user is valid and we should createOrFind it in db
  const userFromDb = await tx.user.findFirst({
    where: {
      first_name: user.first_name,
      AND: {
        last_name: user.last_name,
      },
    },
    include: {
      application: true,
    },
  });

  return !!userFromDb
    ? userFromDb
    : await tx.user.create({
        data: {
          address_city: user.address_city,
          address_state: user.address_state,
          address_street: user.address_street,
          dob: userDOB,
          address_zipcode: user.address_zipcode,
          first_name: user.first_name,
          last_name: user.last_name,
        },
      });
};

export const isValidVin = (vin: string): boolean => {
  const VIN_REGEX = /^[A-HJ-NPR-Z\d]{8}[X\d][A-HJ-NPR-Z\d]{2}\d{6}$/;
  return VIN_REGEX.test(vin);
};

export const isValidVehicleYear = (year: number): boolean => {
  const currentYear = new Date().getFullYear();
  const minYear = 1985;
  const maxYear = currentYear + 1;
  if (isNaN(year) || year < minYear || year > maxYear) {
    return false;
  }
  return true;
};

export const validateVehicles = (
  vehicles: any
): Omit<vehicle, "vehicle_id" | "application_id">[] => {
  if (!isVehicles(vehicles)) {
    throw new Error("incorrect Vehicles");
  }

  if (vehicles.length > 3) {
    throw new Error("only 3 vehicles per application");
  }

  vehicles.forEach((vehicle) => {
    if (!isValidVin(vehicle.vin)) {
      throw new Error(
        `incorrect vin for vehicle: ${vehicle.make} ${vehicle.model}`
      );
    }
    if (!isValidVehicleYear(vehicle.year)) {
      throw new Error(
        `incorrect year for vehicle: ${vehicle.make} ${vehicle.model}`
      );
    }
    vehicle.year = Number(vehicle.year);
  });

  return vehicles;
};
