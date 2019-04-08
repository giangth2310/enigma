export const getChatId = (uid1, uid2) => {
  if (uid1 < uid2) {
    return uid1 + uid2;
  }
  return uid2 + uid1;
}