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
