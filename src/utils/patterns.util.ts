export const patterns = {
  email: /^([\w-.+\d]+@([\w-]+\.)+[\w-]{2,4})?$/,
  password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,30}$/,
  passwordCreate:
    /([a-z]{1,2})([A-Z]{1,2})([\d]{1,2})([\W]{1,2})([A-Z]{1,4})([a-z]{1,5})([\W]{1,5})([\d]{1,4})$/, // this regex is used for generating passwords for tests
};
