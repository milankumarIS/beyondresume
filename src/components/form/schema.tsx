import { literal, number, object, string, TypeOf, z } from "zod";

const loginSchema = object({
  userName: string()
    .trim()
    .min(1, "User Name is required")
    .min(8, "User Name must be more than 8 characters")
    .max(32, "User Name must be less than 32 characters")
    // .regex(new RegExp(".*\\d.*"), "One number")
    .refine((s) => !s.includes(" "), "No Spaces!"),
  password: string()
    .trim()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters")
    .regex(new RegExp(".*[A-Z].*"), "One uppercase character")
    .regex(new RegExp(".*[a-z].*"), "One lowercase character")
    .regex(new RegExp(".*\\d.*"), "One number")
    .regex(
      new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),
      "One special character"
    ),
});

const registerSchema = object({
  userName: string()
    .trim()
    .min(1, "User Name is required")
    .min(8, "User Name must be more than 8 characters")
    .max(32, "User Name must be less than 32 characters")
    // .regex(new RegExp(".*\\d.*"), "One number")
    .refine((s) => !s.includes(" "), "No Spaces!"),
  userEmail: string()
    .trim()
    .min(1, "Email is required")
    .email("Email is invalid"),
  password: string()
    .trim()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters")
    .regex(new RegExp(".*[A-Z].*"), "One uppercase character")
    .regex(new RegExp(".*[a-z].*"), "One lowercase character")
    .regex(new RegExp(".*\\d.*"), "One number")
    .regex(
      new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),
      "One special character"
    ),

  passwordConfirm: string().trim().min(1, "Please confirm your password"),
  userType: z.string().optional(),
  age: string().trim().min(1, "Age is required"),
  terms: literal(true, {
    invalid_type_error: "Accept Terms is required",
  }),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ["passwordConfirm"],
  message: "Passwords do not match",
});

const addMemberSchema = object({
  userName: string()
    .trim()
    .min(1, "User Name is required")
    .min(8, "User Name must be more than 8 characters")
    .max(32, "User Name must be less than 32 characters")
    // .regex(new RegExp(".*\\d.*"), "One number")
    .refine((s) => !s.includes(" "), "No Spaces!"),
  userEmail: string()
    .trim()
    .min(1, "Email is required")
    .email("Email is invalid"),
  password: string()
    .trim()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters")
    .regex(new RegExp(".*[A-Z].*"), "One uppercase character")
    .regex(new RegExp(".*[a-z].*"), "One lowercase character")
    .regex(new RegExp(".*\\d.*"), "One number")
    .regex(
      new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),
      "One special character"
    ),

  passwordConfirm: string().trim().min(1, "Please confirm your password"),
  userType: z.string().optional(),
  communityId: z.coerce.number().min(0, "Select Community"),
  age: string().trim().min(1, "Age is required"),
  terms: literal(true, {
    invalid_type_error: "Accept Terms is required",
  }),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ["passwordConfirm"],
  message: "Passwords do not match",
});

const communitySchema = object({
  communityName: string().trim().min(1, "Community Name is required"),
  communityCode: string().trim().min(1, "Community Code is required"),
  iso3: string().trim().min(1, "Country Code is required"),
});

const g2iRegisterSchema = object({
  userName: string()
    .trim()
    .min(1, "User Name is required")
    .min(8, "User Name must be more than 8 characters")
    .max(32, "User Name must be less than 32 characters")
    .refine((s) => !s.includes(" "), "No Spaces!"),

  password: string()
    .trim()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters")
    .regex(new RegExp(".*[A-Z].*"), "One uppercase character")
    .regex(new RegExp(".*[a-z].*"), "One lowercase character")
    .regex(new RegExp(".*\\d.*"), "One number")
    .regex(
      new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),
      "One special character"
    ),

  nameOfCandidate: string()
    .trim()
    .min(1, "Name is required")
    .refine((value) => /^[A-Za-z\s]*$/.test(value), "Only character"),

  contactEmail: string()
    .trim()
    .min(1, "Email is required")
    .email("Email is invalid"),

  contactPhoneNumber: string()
    .trim()
    .min(1, "Phone Number is required")
    .refine(
      (value) =>
        /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(
          value
        ),
      "Inalid Number"
    ),

  place: string().trim().min(1, "Address is required"),
  competitionCategory: string()
    .trim()
    .min(1, "Competition Category is required"),
  competitionSubject: string().trim().min(1, "Competition Subject is required"),
  nameOfSchool: string().trim().min(1, "Name Of School is required"),
  addressOfSchool: string().trim().min(1, "Address Of School is required"),
  classId: z.coerce.number().min(0, "Select Class"),
  boardId: z.coerce.number().min(0, "Select Board"),

  nameOfParent: string().trim().min(1, "Name Of Parent is required"),
  relationWithParent: string()
    .trim()
    .min(1, "Relation With Parent is required"),

  parentEmail: string()
    .trim()
    .min(1, "Parent Email is required")
    .email("Email is invalid"),

  parentPhoneNumber: string()
    .trim()
    .min(1, "Parent Phone Number is required")
    .refine(
      (value) =>
        /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(
          value
        ),
      "Inalid Number"
    ),
  age: string().trim().min(1, "Age is required"),
});

const forgotPasswordSchema = object({
  userEmail: string()
    .trim()
    .min(1, "Email is required")
    .email("Email is invalid"),
});

const ResetPasswordSchema = object({
  password: string()
    .trim()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters")
    .regex(new RegExp(".*[A-Z].*"), "One uppercase character")
    .regex(new RegExp(".*[a-z].*"), "One lowercase character")
    .regex(new RegExp(".*\\d.*"), "One number")
    .regex(
      new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),
      "One special character"
    ),

  passwordConfirm: string().trim().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ["passwordConfirm"],
  message: "Passwords do not match",
});

const newJobSchema = object({
  categoryId: number().min(1, "Category is required"),
  subCategoryId: number().min(1, "Sub Category is required"),
  jobType: string().trim().min(1, "Job Type is required"),
  durationPeriod: string().trim().optional(),
  duration: string().trim().optional(),
  noOfPerson: string().trim().min(1, "No Of Person is required"),
  city: string()
    .trim()
    .min(1, "City is required")
    .refine((value) => /^[A-Za-z\s]*$/.test(value), "Only character"),
  country: string().trim().min(1, "Country is required"),
  state: string().trim().min(1, "State is required"),
  description: string().trim().min(1, "Description is required"),
  priority: string().trim().min(1, "Priority is required"),
  estimatedLowPrice: string().trim().min(1, "Estimated Low Price is required"),
  estimatedHighPrice: string()
    .trim()
    .min(1, "Estimated High Price is required"),
  estimatedEffortPerDay: string().trim().min(1, "Estimated Effort is required"),
  gender: string().trim().min(1, "Gender is required"),
});

const addressSchema = object({
  villageOrHouseNumber: string()
    .trim()
    .min(1, "Village Or HouseNumber is required")
    .refine(
      (value) => /^[A-Za-z0-9'\.\-\s\,]*$/.test(value),
      "Not Valid Village Or HouseNumber"
    ),
  street: string()
    .trim()
    .refine((value) => /^[A-Za-z\s]*$/.test(value), "Only character")
    .optional(),
  post: string()
    .trim()
    .min(1, "Post is required")
    .refine((value) => /^[A-Za-z\s]*$/.test(value), "Only character"),
  policeStation: string()
    .trim()
    .min(1, "Police Station is required")
    .refine((value) => /^[A-Za-z\s]*$/.test(value), "Only character"),
  city: string()
    .trim()
    .min(1, "City is required")
    .refine((value) => /^[A-Za-z\s]*$/.test(value), "Only character"),
  country: string().trim().min(1, "Country is required"),
  state: string().trim().min(1, "State is required"),
  zipcode: string()
    .trim()
    .min(4, "Pincode is required")
    .max(10, "Pincode is not valid")
    .refine(
      (value) => /^[a-zA-Z0-9]*$/.test(value),
      "Only character or number"
    ),
  addressType: string().trim().min(1, "Address Type is required"),
});

const contactSchema = object({
  userEmail: string()
    .trim()
    .min(1, "Email is required")
    .email("Email is invalid"),
  contactSource: string()
    .trim()
    .refine((value) => /^[A-Za-z\s]*$/.test(value), "Only character"),
  contactType: string()
    .trim()
    .refine((value) => /^[A-Za-z\s]*$/.test(value), "Only character"),
  userContactStatus: string()
    .trim()
    .refine((value) => /^[A-Za-z\s]*$/.test(value), "Only character"),

  userPhoneNumber: string()
    .trim()
    .min(1, "Phone Number is required")
    .refine(
      (value) =>
        /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(
          value
        ),
      "Inalid Number"
    ),
});

const accountSchema = object({
  name: string()
    .trim()
    .min(1, "Name is required")
    .refine((value) => /^[A-Za-z\s]*$/.test(value), "Only character"),
  accountNumber: string()
    .trim()
    .min(8, "Account Number is required")
    .refine((value) => /^[0-9]*$/.test(value), "Only Number"),
  IFSC: string()
    .trim()
    .min(6, "IFSC is required")
    .refine(
      (value) => /^[a-zA-Z0-9]*$/.test(value),
      "Only character or number"
    ),
  bankName: string()
    .trim()
    .min(1, "BankName is required")
    .refine((value) => /^[A-Za-z\s]*$/.test(value), "Only character"),
});

const experienceSchema = object({
  duration: string().trim().min(1, "Duration Or HouseNumber is required"),
  city: string()
    .trim()
    .min(1, "City is required")
    .refine((value) => /^[A-Za-z\s]*$/.test(value), "Only character"),
  country: string().trim().min(1, "Country is required"),
  state: string().trim().min(1, "State is required"),
  jobProviderName: string().trim().min(1, "job Provider Name is required"),
  categoryId: number().min(1, "Category is required"),
  subCategoryId: number().min(1, "Sub Category is required"),
});

const userSchema = object({
  firstName: string()
    .trim()
    .min(1, "First Name is required")
    .refine((value) => /^[A-Za-z\s]*$/.test(value), "Only character"),
  middleName: string()
    .trim()
    .refine((value) => /^[A-Za-z\s]*$/.test(value), "Only character"),
  lastName: string()
    .trim()
    .min(1, "Last Name is required")
    .refine((value) => /^[A-Za-z\s]*$/.test(value), "Only character"),
  genderId: number().min(1, "Gender is required"),
  // dob: string().trim().min(1, 'Duration Or HouseNumber is required'),
  nationalId: string()
    .trim()
    .min(1, "National Id is required")
    .min(12, "Enter Valid National Id Number")
    .max(12, "Enter Valid National Id Number"),
  age: string().trim().min(1, "Age is required"),
});

const complaintSchema = object({
  email: string().trim().min(1, "Email is required").email("Email is invalid"),
  subject: string()
    .trim()
    .min(1, "Subject is required")
    .max(30, "Subject should be less then 30 characters"),
  description: string().trim().min(1, "Description is required"),
  firstName: string()
    .trim()
    .min(1, "First Name is required")
    .refine((value) => /^[A-Za-z\s]*$/.test(value), "Only character"),
  lastName: string()
    .trim()
    .min(1, "Last Name is required")
    .refine((value) => /^[A-Za-z\s]*$/.test(value), "Only character"),
});

const appointmentSchema = object({
  entityId: z.number().min(1, "Entity Type is required"),

  // appointmentType:string().trim().min(1, "Appointment Type is required"),
  gender: string().trim().min(1, "Gender is required"),
  criticality: string().trim().min(1, "Criticality is required"),

  drName: string().trim().min(1, "Field is required"),

  phoneNumber: string()
    .trim()
    .min(1, "Phone Number is required")
    .refine(
      (value) =>
        /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(
          value
        ),
      "Inalid Number"
    ),
  description: string().trim().optional(),
  firstName: string()
    .trim()
    .min(1, "First Name is required")
    .refine((value) => /^[A-Za-z\s]*$/.test(value), "Only character"),
  lastName: string()
    .trim()
    .min(1, "Last Name is required")
    .refine((value) => /^[A-Za-z\s]*$/.test(value), "Only character"),
  age: string().trim().min(1, "Age is required"),
});

const registrationCertificateSchema = z.object({
  registrationNumber: z
    .string()
    .trim()
    .min(1, "Registration number is required")
    .regex(/^[A-Za-z0-9]+$/, "Must be alphanumeric"),

  chassisNumber: z
    .string()
    .trim()
    .min(1, "Chassis number is required")
    .regex(/^[A-Za-z0-9]+$/, "Must be alphanumeric"),

  engineNumber: z
    .string()
    .trim()
    .min(1, "Engine number is required")
    .regex(/^[A-Za-z0-9]+$/, "Must be alphanumeric"),

  make: z
    .string()
    .trim()
    .min(1, "Make is required")
    .regex(/^[A-Za-z0-9\s]+$/, "Must be alphanumeric and can contain spaces"),

  color: z
    .string()
    .trim()
    .min(1, "Color is required")
    .regex(/^[A-Za-z0-9\s]+$/, "Must be alphanumeric and can contain spaces"),

  seatingCapacity: z
    .string()
    .trim()
    .min(1, "Seating Capacity is required")
    .refine((value) => /^[0-9]*$/.test(value), "Only Number"),

  model: z
    .string()
    .trim()
    .min(1, "Model is required")
    .regex(
      /^[A-Za-z0-9\s\-]+$/,
      "Must be alphanumeric and can contain hyphens or spaces"
    ),

  vehicleCategories: z.string().trim().min(1, "Vehicle Category is required"),

  fuel: z.string().trim().min(1, "Fuel is required"),

  name: z
    .string()
    .min(1, { message: "Name is required" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces",
    }),

  sonOf: z
    .string()
    .min(1, { message: "Son of  is required" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Son of  can only contain letters and spaces",
    }),

  address: z.string().min(1, "Address is required"),
});

const insuranceCardSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .regex(/^[A-Za-z\s]+$/, "Only alphabets allowed"),

  address: z
    .string()
    .trim()
    .min(1, "Address is required")
    .regex(/^[A-Za-z\s]+$/, "Only alphabets and spaces allowed"),

  registrationNumber: z
    .string()
    .trim()
    .min(1, "Registration number is required")
    .regex(/^[A-Za-z0-9]+$/, "Must be alphanumeric"),

  chassisNumber: z
    .string()
    .trim()
    .min(1, "Chassis number is required")
    .regex(/^[A-Za-z0-9]+$/, "Must be alphanumeric"),

  make: z
    .string()
    .trim()
    .min(1, "Make is required")
    .regex(/^[A-Za-z0-9\s]+$/, "Must be alphanumeric and can contain spaces"),

  model: z
    .string()
    .trim()
    .min(1, "Model is required")
    .regex(
      /^[A-Za-z0-9\s\-]+$/,
      "Must be alphanumeric and can contain hyphens or spaces"
    ),

  vehicleCategories: z.string().trim().min(1, "Category is required"),

  fuel: z.string().trim().min(1, "Fuel is required"),

  policyNumber: z
    .string()
    .trim()
    .min(1, "Policy Number is required")
    .regex(/^[A-Za-z0-9\s\/]+$/, "Must be alphanumeric and can contain slash"),
});

const pucCardSchema = z.object({
  registrationNumber: z
    .string()
    .trim()
    .min(1, "Registration number is required")
    .regex(/^[A-Za-z0-9]+$/, "Must be alphanumeric"),

  chassisNumber: z
    .string()
    .trim()
    .min(1, "Chassis number is required")
    .regex(/^[A-Za-z0-9]+$/, "Must be alphanumeric"),

  make: z
    .string()
    .trim()
    .min(1, "Make is required")
    .regex(/^[A-Za-z0-9\s]+$/, "Must be alphanumeric and can contain spaces"),

  model: z
    .string()
    .trim()
    .min(1, "Model is required")
    .regex(
      /^[A-Za-z0-9\s\-]+$/,
      "Must be alphanumeric and can contain hyphens or spaces"
    ),

  vehicleCategories: z.string().trim().min(1, "Category is required"),

  stroke: z.string().trim().min(1, "Stroke is required"),

  fuel: z.string().trim().min(1, "Fuel is required"),

  prescribedCO: z
    .string()
    .trim()
    .min(1, "Prescribed CO is required")
    .refine(
      (value) => /^[0-9]+(\.[0-9]+)?$/.test(value),
      "Only numbers or decimals are allowed"
    ),

  measuredCO: z
    .string()
    .trim()
    .min(1, "Measured CO is required")
    .refine(
      (value) => /^[0-9]+(\.[0-9]+)?$/.test(value),
      "Only numbers or decimals are allowed"
    ),

  prescribedHC: z
    .string()
    .trim()
    .min(1, "Prescribed HC is required")
    .refine(
      (value) => /^[0-9]+(\.[0-9]+)?$/.test(value),
      "Only numbers or decimals are allowed"
    ),

  measuredHC: z
    .string()
    .trim()
    .min(1, "Measured HC is required")
    .refine(
      (value) => /^[0-9]+(\.[0-9]+)?$/.test(value),
      "Only numbers or decimals are allowed"
    ),

  puc: z.string().trim().min(1, "Pollution Under Control is required"),
});

const fitnessCardSchema = z.object({
  registrationNumber: z
    .string()
    .min(1, "Registration number is required")
    .regex(/^[A-Za-z0-9]+$/, "Must be alphanumeric"),

  chassisNumber: z
    .string()
    .min(1, "Chassis number is required")
    .regex(/^[A-Za-z0-9]+$/, "Must be alphanumeric"),

  engineNumber: z
    .string()
    .min(1, "Engine number is required")
    .regex(/^[A-Za-z0-9]+$/, "Must be alphanumeric"),

  seatingCapacity: z
    .string()
    .trim()
    .min(1, "Seating Capacity is required")
    .refine((value) => /^[0-9]*$/.test(value), "Only Number"),

  category: z.string().min(1, "Category is required"),

  vehicleBodies: z.string().min(1, "Type of body is required"),

  inspectedBy: z.string().min(1, "Inspector name is required"),

  applicationNumber: z
    .string()
    .min(1, "Application number is required")
    .regex(/^[A-Za-z0-9]+$/, "Must be alphanumeric"),
});

const vehicleSchema = z.object({
  vehicleType: string().trim().min(1, "VehicleType is required"),
  model: z.string().min(1, "Model is required"),
  number: z.string().min(1, "Vehicle Number is required"),
  color: z.string().min(1, "Color is required"),
  vehicleOwnerName: z.string().trim().optional(),
  condition: z.string().min(1, "Condition is required"),

  running: z
    .string()
    .trim()
    .min(1, "Running is required")
    .refine((value) => /^[0-9]*$/.test(value), "Only Number"),

  passengerCapacity: z
    .string()
    .trim()
    .min(1, "Passenger capacity is required")
    .refine((value) => /^[0-9]*$/.test(value), "Only Number"),

  motorPower: z
    .string()
    .trim()
    .min(1, "Motor power is required")
    .refine((value) => /^[0-9]*$/.test(value), "Only Number"),

  maxSpeed: z
    .string()
    .trim()
    .min(1, "Max Speed is required")
    .refine((value) => /^[0-9]*$/.test(value), "Only Number"),
});

const drivingLicenseSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces",
    }),

  sonOf: z.string().min(1, "Son of  is required"),

  address: z.string().min(1, "Address is required"),

  licenseNumber: z.string().min(1, "License number is required"),

  signature: z
    .string()
    .nonempty("Signature is required")
    .refine((data) => data !== "", { message: "Signature cannot be empty" }),
});

const vehicleCatagorySchema = z.object({
  code: z.string().min(1, "Vehicle Class Code is required"),
});

const NationalIdCardSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces",
    }),

  sonOf: z.string().min(1, "C/O is required"),

  address: z.string().min(1, "Address is required"),

  phoneNumber: string()
    .trim()
    .min(1, "Phone Number is required")
    .refine(
      (value) =>
        /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(
          value
        ),
      "Inalid Number"
    ),

  gender: string().trim().min(1, "Gender is required"),

  nationalId: string()
    .trim()
    .min(1, "National Id is required")
    .min(12, "Enter Valid National Id Number")
    .max(12, "Enter Valid National Id Number")
    .refine((value) => /^[0-9]*$/.test(value), "Only Number"),
});

const panCardSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces",
    }),

  gender: string().trim().min(1, "Gender is required"),

  panNumber: string()
    .trim()
    .min(1, "PAN Number is required")
    .min(10, "Enter Valid PAN Number")
    .max(10, "Enter Valid PAN Number"),
  signature: z
    .string()
    .nonempty("Signature is required")
    .refine((data) => data !== "", { message: "Signature cannot be empty" }),
});

const vehiclePermitSchema = z.object({
  permitNumber: z
    .string()
    .trim()
    .min(1, "Permit number is required")
    .regex(/^[A-Za-z0-9]+$/, "Must be alphanumeric"),

  registrationNumber: z
    .string()
    .min(1, "Registration number is required")
    .regex(/^[A-Za-z0-9]+$/, "Must be alphanumeric"),

  chassisNumber: z
    .string()
    .min(1, "Chassis number is required")
    .regex(/^[A-Za-z0-9]+$/, "Must be alphanumeric"),

  engineNumber: z
    .string()
    .min(1, "Engine number is required")
    .regex(/^[A-Za-z0-9]+$/, "Must be alphanumeric"),

  seatingCapacity: z
    .string()
    .trim()
    .min(1, "Seating Capacity is required")
    .refine((value) => /^[0-9]*$/.test(value), "Only Number"),

  category: z.string().min(1, "Category is required"),
  permitType: z.string().min(1, "Permit Type is required"),
  routeDetails: z.string().min(1, "Route Details is required"),
  purposeOfUse: z.string().min(1, "Purpose of Use is required"),
  permitIssueAuthority: z
    .string()
    .min(1, "Permit Issuing Authority is required"),
  conditionOfPermit: z.string().min(1, "Conditions of Permit is required"),

  name: z
    .string()
    .min(1, { message: "Name is required" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces",
    }),
  address: z.string().min(1, "Address is required"),

  make: z
    .string()
    .trim()
    .min(1, "Make is required")
    .regex(/^[A-Za-z0-9\s]+$/, "Must be alphanumeric and can contain spaces"),

  model: z
    .string()
    .trim()
    .min(1, "Model is required")
    .regex(
      /^[A-Za-z0-9\s\-]+$/,
      "Must be alphanumeric and can contain hyphens or spaces"
    ),
});

const councilLicenseSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces",
    }),

  sonOf: z.string().min(1, "Son of  is required"),

  address: z.string().min(1, "Address is required"),

  licenseNumber: z.string().min(1, "Registration number is required"),

  signature: z
    .string()
    .nonempty("Signature is required")
    .refine((data) => data !== "", { message: "Signature cannot be empty" }),
});

const doctorateCertificateSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces",
    }),

  college: z.string().min(1, "College Name is required"),

  department: z.string().min(1, "Department is required"),
  certificateNumber: z.string().min(1, "Registration number is required"),
  signature: z
    .string()
    .nonempty("Signature is required")
    .refine((data) => data !== "", { message: "Signature cannot be empty" }),
});
const nursingCertificateSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces",
    }),

  hospital: z.string().min(1, "Hospital Name is required"),

  department: z.string().min(1, "Department is required"),
  authority: z.string().min(1, "Authority is required"),

  signature: z
    .string()
    .nonempty("Signature is required")
    .refine((data) => data !== "", { message: "Signature cannot be empty" }),
});

const availabilitySchema = z.object({
  address: z.string().min(1, "Clinic address is required"),
  toTime: z.date(),
  fromTime: z.date(),
  signature: z
    .string()
    .nonempty("Signature is required")
    .refine((data) => data !== "", { message: "Signature cannot be empty" }),
});

const refferalSchema = z.object({
  code: z.string().min(1, "Code is required"),
});

const jobAddSchema = z.object({
  categoryId: z.number().min(1, "Category is required"),
  subCategoryId: z.number().min(1, "Sub Category is required"),
  jobTitle: z.string().min(1, "Job Title is required"),
  noOfVacancy: z.string().min(1, "Number of vacancies is required"),
  estimatedLowSalary: z.string().min(1, "Low salary estimate is required"),
  estimatedHighSalary: z.string().min(1, "High salary estimate is required"),
  jobDescription: z.string().min(1, "Job description is required"),
  skills: z.string().min(1, "Skills are required"),
  companyName: z.string().min(1, "Company name is required"),
  contactPersonName: z.string().min(1, "Contact Person Name is required"),
  contactPhoneNumber: z.string().min(1, "Phone number is required"),
  contactEmailId: z.string().email("Invalid email address"),
  contactPersonProfile: z.string().min(1, "Contact person profile is required"),
  sizeOfOrganization: z.string().min(1, "Size of Organization is required"),
  jobAddress: z.string().min(1, "Job address is required"),
  hiringFrequency: z.string().min(1, "Hiring Frequency type is required"),
  cerification: z.string().min(1, "Certification is required"),
  degreeAndSpecialisation: z
    .string()
    .min(1, "Degree and Specialisation is required"),
  jobTiming: z.string().min(1, "Job timing is required"),
  interviewDetails: z.string().min(1, "Interview details are required"),
  minimumAge: z.string().min(1, "Minimum Age is required"),
  maximumAge: z.string().min(1, "Maximum Age is required"),
  assets: z.array(z.string()).min(1, "At least one asset is required"),
  preferredIndustry: z
    .array(z.string())
    .min(1, "At least one preferred industry is required"),
  preferredLanguage: z
    .array(z.string())
    .min(1, "At least one preferred language is required"),
  jobLocationCity: z
    .string()
    .trim()
    .min(1, "City is required")
    .refine(
      (value) => /^[A-Za-z\s]*$/.test(value),
      "Only characters are allowed"
    ),
  jobLocationCountry: z.string().trim().min(1, "Country is required"),
  jobLocationState: z.string().trim().min(1, "State is required"),
  experienceRequired: z
    .string()
    .trim()
    .min(1, "Experience is required")
    .refine(
      (value) => ["Any", "Fresher Only", "Experience Only"].includes(value),
      "Invalid option selected for experience"
    ),
  bonusSalary: z
    .string()
    .trim()
    .min(1, "Bonus salary is required")
    .refine(
      (value) => ["Yes", "No"].includes(value),
      "Invalid option selected for bonus salary"
    ),
  dailyOpportunityStatus: z.string().min(1, "Status is required"),
});

const jobPostSchema = z.object({
  categoryId: number().min(1, "Category is required"),
  subCategoryId: number().min(1, "Sub Category is required"),
  companyName: z.string().min(1, "Company name is required"),
  noOfVacancy: z.string().trim().optional(),
  estimatedLowSalary: z.string().trim().optional(),
  estimatedHighSalary: z.string().trim().optional(),
  contactPhoneNumber: z.string().trim().optional(),
  contactEmail: z.string().trim().optional(),
  jobDescription: z.string().trim().optional(),
  jobType: z.string().trim().optional(),
  dailyOppertunityStatus: z.string().min(1, "Status is Required"),
  city: string().trim().optional(),
  country: string().trim().optional(),
  state: string().trim().optional(),
  experienceRequired: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => (value ? /^-?\d+(\.\d+)?$/.test(value) : "0"),
      "Only numbers or decimals are allowed"
    ),
  skillsRequiredForJob: z.string().trim().optional(),
  dailyOppertunitySourceLink: z.string().trim().optional(),
});

const eventRegistrationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required"),
  phone: z.string().min(1, "Phone number is required"),
  organization: z.string().min(1, "Organization is required"),
});

const marketSchema = z.object({
  productRows: z
    .array(
      z.object({
        serialNo: z.number().min(1, "Serial number is required"),
        date: z.string().min(1, "Date is required"),
        item: z.string().min(1, "Item is required"),
        quantity: z.string().min(1, "Quantity is required"),
      })
    )
    .min(1, "At least one row is required"),
});

const storeDetailsSchema = z.object({
  storeName: z
    .string()
    .min(1, "Store Name is required")
    .max(100, "Store Name is too long"),
  storeType: z.string().min(1, "Store Type is required"),
  moduleId: z.number().min(1, "Select One Module"),
  // yearOfEstablishment: z.number(),
  GSTINNumber: z.string().transform((value) => value.toUpperCase()),
  storeContact: string()
    .trim()
    .min(1, "Cotact Number is required")
    .refine(
      (value) =>
        /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(
          value
        ),
      "Inalid Number"
    ),
});

const labSchema = z.object({
  digitalMedicalLabName: z
    .string()
    .min(1, "Lab Name is required")
    .max(100, "Lab Name is too long"),
  digitalMedicalLabSpeciality: z
    .array(z.string())
    .min(1, "At least one Lab Speciality is required"),
  // digitalMedicalLabOwner: z.string().min(1, "Lab Speciality is required"),

  digitalMedicalLabContactNumber: string()
    .trim()
    .min(1, "Cotact Number is required")
    .refine(
      (value) =>
        /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(
          value
        ),
      "Inalid Number"
    ),
});

const healthOnBoardSchema = z.object({
  name: z.string().min(1, "Name is required"),

  entityId: z.number().min(1, "Entity Type is required"),
  // DigitalEntityId: z.number().min(1, "Select Your Digital Entity"),

  // selectedDigitalEntity: z.string().min(1, "Digital Entity is required"),
  // address: z.string().min(1, "Address is required"),
  contact: string()
    .trim()
    .min(1, "Contact Number is required")
    .refine(
      (value) =>
        /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(
          value
        ),
      "Inalid Number"
    ),
  availableFrom: z.string().min(1, "Time is required"),
  availableTo: z.string().min(1, "Time is required"),
  signature: z
    .string()
    .nonempty("Signature is required")
    .refine((data) => data !== "", { message: "Signature cannot be empty" }),
});
const adminHealthOnBoardSchema = z.object({
  name: z.string().min(1, "Name is required"),
  entityId: z.number().min(1, "Entity Type is required"),
  contact: string()
    .trim()
    .min(1, "Contact Number is required")
    .refine(
      (value) =>
        /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(
          value
        ),
      "Inalid Number"
    ),
  signature: z
    .string()
    .nonempty("Signature is required")
    .refine((data) => data !== "", { message: "Signature cannot be empty" }),
});

const logisticDetailsSchema = z.object({
  primaryContact: string()
    .trim()
    .min(1, "Primary Cotact Number is required")
    .refine(
      (value) =>
        /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(
          value
        ),
      "Inalid Number"
    ),
});

const addProductSchema = z.object({
  productId: z.coerce.number().min(1, "Select Product"),
  productPrice: z.string().min(1, "Product Price is required"),
  stock: z.string().min(1, "Product Stock is required"),
  productDisplayName: z.string().min(1, "Product Display Name is required"),
  // productType: z.string().min(1, "Product Type is required"),
  productDisplayType: z.string().min(1, "Product Display Type is required"),
  deliveryTime: z.string().min(1, "Delivery Time is required"),
  seasonDisplayName: z.string().trim().optional(),
  rackNumber: z.string().trim().optional(),
  quantity: z.string().min(1, "Product Quantity is required"),
  unit: z.string().min(1, "Unit is required"),
  // sellerProductListDescription:z.string().min(1, "Product Desc is Required"),
  sellerProductListStatus: z.string().min(1, "Product status is Required"),
});

const digitalStandSchema = z.object({
  digitalStandId: z.number().min(1, "Select Your Digital Stand"),
});

const digitalClinicSchema = z.object({
  digitalClinicId: z.number().min(1, "Select Your Digital Clinic"),
});

const returnFormSchema = z.object({
  reason: z.string().nonempty("Reason for return is required"),
  additionalComments: z
    .string()
    .max(250, "Comments must be under 250 characters"),
});

const cancelFormSchema = z.object({
  reason: z.string().nonempty("Reason for cancel is required"),
  additionalComments: z
    .string()
    .max(250, "Comments must be under 250 characters"),
});
const digitalMarketSchema = z.object({
  digitalMarketId: z.number().min(1, "Select Your Digital Market"),
});

const patientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email").nonempty("Email is required"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),

  emergencyName: z.string().min(1, "Emergency contact name is required"),
  emergencyRelationship: z.string().min(1, "Relationship is required"),
  emergencyPhone: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be 10 digits"),

  primaryInsurance: z.string().min(1, "Primary insurance is required"),
  primaryPolicyHolder: z.string().min(1, "Policyholder's name is required"),
  primaryPolicyNumber: z.string().min(1, "Policy number is required"),

  reasonforVisit: z.string().min(1, "Reason For Visit is required"),
});

const jobApplySchema = z.object({
  categoryId: z.number().min(1, "Category is required"),
  subCategoryId: z.number().min(1, "Sub Category is required"),
  companyName: z.string().min(1, "Company name is required"),
  noOfVacancy: z.string().trim().optional(),
  estimatedLowSalary: z.string().trim().optional(),
  estimatedHighSalary: z.string().trim().optional(),
  contactPhoneNumber: z.string().min(1, "Contact Number is required"),
  contactEmail: z.string().min(1, "Email Id is required"),
  jobTitle: z.string().trim().min(1, "Job Title is required"),
  sizeOfOrganization: z.string().trim().optional(),
  jobAddress: z.string().optional(),
  jobType: z.string().trim().optional(),
  country: string().trim().optional(),
  state: string().trim().optional(),
  city: string().trim().optional(),
  experienceRequired: z.string().optional(),
  gender: z.string().optional(),
  qualification: z.string().optional(),
  bonusSalary: z.string().optional(),
  minimumAge: z.string().trim().optional(),
  maximumAge: z.string().trim().optional(),
  skillsRequiredForJob: z.array(z.string()).optional(),
  assets: z.array(z.string()).optional(),
  preferredIndustry: z.array(z.string()).optional(),
  preferredLanguage: z.array(z.string()).optional(),
  degreeAndSpecialisation: z.string().optional(),
  jobTiming: z.string().optional(),
  interviewDetails: z.string().optional(),
  hiringFrequency: z.string().trim().optional(),
  dailyOppertunitySourceLink: z.string().trim().optional(),
  dailyOppertunityStatus: z.string().min(1, "Status is Required"),
});

const dailyEducationSchema = object({
  qna: z.string().min(1, "Field is required"),
});

const dailyEducationSubjectSchema = object({
  canvasName: z.string().min(1, "Canvas name is required"),
  boardId: z.coerce.number().min(0, "Select Board"),
  classId: z.coerce.number().min(0, "Select Class"),
});

const dailyEducationChapterSchema = object({
  chapterName: z.string().min(1, "Chapter name is required"),
});

const familyConnectSchema = z.object({
  connectionName: z.string().min(1, "Enter Your Full Name"),
  contactNumber: z
    .string()
    .min(10, "Enter Your Contact Number")
    .max(12, "Contact Number should not exceed 12 digits"),
  roleOrRelationship: z.string().trim().min(1, "Select Your Relationship"),
  contactConnectType: z.string().trim().min(1, "Select Your Connection Type"),
});

const joinMeetingSchema = z.object({
  meetingId: z.string().min(1, "Enter Your Meeting Id"),
  fullName: z.string().min(1, "Enter Your Full Name"),
});

const courseDescriptionSchema = z.object({
  learningObjectives: z.array(z.string().min(1, "Objective cannot be empty")),
  whoCanJoin: z.string().min(1, "This field is required"),
  requiredSkills: z.string().min(1, "This field is required"),
});

const courseContentSchema = z.object({
  sections: z.array(
    z.object({
      title: z.string().min(1, "Section title is required"),
      lectures: z.array(
        z.object({
          title: z.string().min(1, "Lecture title is required"),
          description: z.string().optional(),
        })
      ),
    })
  ),
});

const createCourseschema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters long")
    .max(50, "Title cannot exceed 50 characters"),
  selectedOptions: z
    .array(z.string())
    .min(1, "Please select at least one category"),
  selectedText: z.string().nonempty("Please select a time option"),

  boardId: z.coerce.number().min(0, "Select Board"),
  classId: z.coerce.number().min(0, "Select Class"),
});

const testVideoSchema = z.object({
  selectedLanguage: z.string().nonempty("Please select a language."),
  filmingOptions: z.string().nonempty("Please choose a filming option."),
  cameraType: z.string().nonempty("Please select a camera type."),
  microphoneType: z.string().nonempty("Please select a microphone type."),
  operatingSystem: z.string().nonempty("Please choose an operating system."),
});

const beyondResumeSchema = z.object({
  companyName: z.string().nonempty("Company Name is required"),
  skills: z.string().nonempty("Skill is required"),
  jobTitle: z.string().nonempty("Job Title is required"),
  experience: z.string().nonempty("Experience is required"),
  jobType: z.string().nonempty("Job Type is required"),
  jobMode: z.string().nonempty("Job Mode is required"),
  payroll: z.string().nonempty("Job Mode is required"),
  compensation: z.string().nonempty("Compensation is required"),
  location: z.string().nonempty("Location is required"),
});

const interviewFormSchema = z.object({
  fullName: z.string().min(2, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  phone: string()
    .trim()
    .min(1, "Phone Number is required")
    .refine(
      (value) =>
        /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(
          value
        ),
      "Inalid Number"
    ),
  previousCompany: z.string().optional(),
  yearsExperience: z.coerce.number().min(0, "Years of experience required"),
  linkedIn: z.string().url("Must be a valid URL").or(z.literal("")),
});

const companySchema = z.object({
  industryName: z
    .string()
    .min(2, { message: "Industry name must be at least 2 characters long." }),
  industryCategory: z
    .string()
    .min(2, { message: "Industry category is required." }),
  industryType: z.string().min(2, { message: "Industry type is required." }),
  industryClassification: z
    .string()
    .min(2, { message: "Industry classification is required." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long." }),
    establishedYear: z
    .number({
      required_error: "Established year is required",
      invalid_type_error: "Established year must be a valid year",
    })
    .min(1800, { message: "Established year cannot be earlier than 1800." })
    .max(new Date().getFullYear(), {
      message: `Established year cannot be later than ${new Date().getFullYear()}.`,
    })
    .int(),
  headquartersCity: z
    .string()
    .min(2, { message: "City must be at least 2 characters long." }),
  headquartersState: z
    .string()
    .min(2, { message: "State must be at least 2 characters long." }),
  headquartersCountry: z
    .string()
    .min(2, { message: "Country must be at least 2 characters long." }),
  website: z.string().url({
    message: "Please enter a valid website URL (e.g., https://example.com).",
  }),
  logoUrl: z.string().url({
    message:
      "Please provide a valid logo image URL (e.g., https://example.com/logo.png).",
  }),
  bannerUrl: z.string().url({
    message:
      "Please provide a valid banner image URL (e.g., https://example.com/banner.jpg).",
  }),
  primaryContactName: z.string().min(2, {
    message: "Primary contact name must be at least 2 characters long.",
  }),
  primaryContactEmail: z
    .string()
    .email({ message: "Please enter a valid email address." }),
  primaryContactPhone: z
    .string()
    .trim()
    .min(1, "Comapany contact number is required")
    .refine(
      (value) =>
        /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(
          value
        ),
      "Inalid Number"
    ),
  companyContactEmail: z
    .string()
    .email({ message: "Please enter a valid email address." }),
  companyContactPhone: z
    .string()
    .trim()
    .min(1, "Comapany contact number is required")
    .refine(
      (value) =>
        /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(
          value
        ),
      "Inalid Number"
    ),
      linkedin: z
    .string()
    .url({ message: "LinkedIn must be a valid URL." })
    .optional()
    .or(z.literal("")),
  insta: z
    .string()
    .url({ message: "Instagram must be a valid URL." })
    .optional()
    .or(z.literal("")),
  twitter: z
    .string()
    .url({ message: "Twitter must be a valid URL." })
    .optional()
    .or(z.literal("")),
  fb: z
    .string()
    .url({ message: "Facebook must be a valid URL." })
    .optional()
    .or(z.literal("")),
});

const gallerySchema = z.object({
  gallery: z.array(
    z.object({
      imageUrl: z.string().url(),
    })
  ),
});

const awardSchema = z.object({
  awards: z.array(
    z.object({
       cAwardId: z.number().optional(),
      title: z.string().min(2),
      description: z.string().min(10),
      imageURL: z.string().url(),
    })
  ),
});

const newsSchema = z.object({
  news: z.array(
    z.object({
      title: z.string().min(2),
      description: z.string().min(10),
      imageURL: z.string().url(),
    })
  ),
});

export {
  accountSchema,
  addMemberSchema,
  addProductSchema,
  addressSchema,
  adminHealthOnBoardSchema,
  appointmentSchema,
  availabilitySchema,
  awardSchema,
  beyondResumeSchema,
  cancelFormSchema,
  communitySchema,
  companySchema,
  complaintSchema,
  contactSchema,
  councilLicenseSchema,
  courseContentSchema,
  courseDescriptionSchema,
  createCourseschema,
  dailyEducationChapterSchema,
  dailyEducationSchema,
  dailyEducationSubjectSchema,
  digitalClinicSchema,
  digitalMarketSchema,
  digitalStandSchema,
  doctorateCertificateSchema,
  drivingLicenseSchema,
  eventRegistrationSchema,
  experienceSchema,
  familyConnectSchema,
  fitnessCardSchema,
  forgotPasswordSchema,
  g2iRegisterSchema,
  gallerySchema,
  healthOnBoardSchema,
  insuranceCardSchema,
  interviewFormSchema,
  jobAddSchema,
  jobApplySchema,
  jobPostSchema,
  joinMeetingSchema,
  labSchema,
  loginSchema,
  logisticDetailsSchema,
  marketSchema,
  NationalIdCardSchema,
  newJobSchema,
  newsSchema,
  nursingCertificateSchema,
  panCardSchema,
  patientSchema,
  pucCardSchema,
  refferalSchema,
  registerSchema,
  registrationCertificateSchema,
  ResetPasswordSchema,
  returnFormSchema,
  storeDetailsSchema,
  testVideoSchema,
  userSchema,
  vehicleCatagorySchema,
  vehiclePermitSchema,
  vehicleSchema
};

type loginInput = TypeOf<typeof loginSchema>;
type RegisterInput = TypeOf<typeof registerSchema>;
type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>;
type ResetPasswordInput = TypeOf<typeof ResetPasswordSchema>;
type NewJobInput = TypeOf<typeof newJobSchema>;
type AddressInput = TypeOf<typeof addressSchema>;
type AccountInput = TypeOf<typeof accountSchema>;
type ExperienceInput = TypeOf<typeof experienceSchema>;
type UserInput = TypeOf<typeof userSchema>;
type ComplaintRegisterType = TypeOf<typeof complaintSchema>;
type AppointmentType = TypeOf<typeof appointmentSchema>;
type RegistrationCertificatType = TypeOf<typeof registrationCertificateSchema>;
type InsuranceCardType = TypeOf<typeof insuranceCardSchema>;
type pucCardType = TypeOf<typeof pucCardSchema>;
type FitnessCertificateType = TypeOf<typeof fitnessCardSchema>;
type DrivingLicenseType = TypeOf<typeof drivingLicenseSchema>;
type VehicleCatagoryType = TypeOf<typeof vehicleCatagorySchema>;
type NationalIdCardType = TypeOf<typeof NationalIdCardSchema>;
type PANCardType = TypeOf<typeof panCardSchema>;
type VehiclePermitType = TypeOf<typeof vehiclePermitSchema>;
type CouncilLicenseSchemaType = TypeOf<typeof councilLicenseSchema>;
type DoctorateCertificateType = TypeOf<typeof doctorateCertificateSchema>;
type AvailabilitySchemaType = TypeOf<typeof availabilitySchema>;
type RefferalSchemaType = TypeOf<typeof refferalSchema>;
type ContactSchemaType = TypeOf<typeof contactSchema>;
type JobPostSchemaType = TypeOf<typeof jobPostSchema>;
type JobApplySchemaType = TypeOf<typeof jobApplySchema>;
type marketSchemaType = TypeOf<typeof marketSchema>;
type storeDetailsSchemaType = TypeOf<typeof storeDetailsSchema>;
type addProductSchemaType = TypeOf<typeof addProductSchema>;
type DigitalStandSchemaType = TypeOf<typeof digitalStandSchema>;
type DigitalClinicSchemaType = TypeOf<typeof digitalClinicSchema>;
type DigitalMarketSchemaType = TypeOf<typeof digitalMarketSchema>;
type JobAddSchemaType = TypeOf<typeof jobAddSchema>;
type logisticDetailsType = TypeOf<typeof logisticDetailsSchema>;
type CancelFormValues = z.infer<typeof cancelFormSchema>;
type ReturnFormValues = z.infer<typeof returnFormSchema>;
type NursingCertificateType = z.infer<typeof nursingCertificateSchema>;
type LabSchemaType = TypeOf<typeof labSchema>;
type HealthOnBoardSchemaType = TypeOf<typeof healthOnBoardSchema>;
type PatientFormData = z.infer<typeof patientSchema>;
type adminHealthOnBoardSchemaType = TypeOf<typeof adminHealthOnBoardSchema>;
type dailyEducationSchemaType = TypeOf<typeof dailyEducationSchema>;
type dailyEducationSubjectSchemaType = TypeOf<
  typeof dailyEducationSubjectSchema
>;
type dailyEducationChapterSchemaType = TypeOf<
  typeof dailyEducationChapterSchema
>;
type FamilyConnectSchemaType = TypeOf<typeof familyConnectSchema>;
type JoinMeetingSchemaType = TypeOf<typeof joinMeetingSchema>;
type courseDescriptionSchemaType = z.infer<typeof courseDescriptionSchema>;
type createCourseschemaType = z.infer<typeof createCourseschema>;
type courseContentSchemaType = z.infer<typeof courseContentSchema>;
type testVideoSchemaType = z.infer<typeof testVideoSchema>;
type EventRegistrationSchemaType = z.infer<typeof eventRegistrationSchema>;
type G2iRegisterSchemaType = z.infer<typeof g2iRegisterSchema>;
type AddMemberSchemaType = z.infer<typeof addMemberSchema>;
type CommunitySchemaType = z.infer<typeof communitySchema>;
type BeyondResumeSchemaType = z.infer<typeof beyondResumeSchema>;
type InterviewFormSchemaType = z.infer<typeof interviewFormSchema>;

export type {
  AccountInput,
  AddMemberSchemaType,
  addProductSchemaType,
  AddressInput,
  adminHealthOnBoardSchemaType,
  AppointmentType,
  AvailabilitySchemaType,
  BeyondResumeSchemaType,
  CancelFormValues,
  CommunitySchemaType,
  ComplaintRegisterType,
  ContactSchemaType,
  CouncilLicenseSchemaType,
  courseContentSchemaType,
  courseDescriptionSchemaType,
  createCourseschemaType,
  dailyEducationChapterSchemaType,
  dailyEducationSchemaType,
  dailyEducationSubjectSchemaType,
  DigitalClinicSchemaType,
  DigitalMarketSchemaType,
  DigitalStandSchemaType,
  DoctorateCertificateType,
  DrivingLicenseType,
  EventRegistrationSchemaType,
  ExperienceInput,
  FamilyConnectSchemaType,
  FitnessCertificateType,
  ForgotPasswordInput,
  G2iRegisterSchemaType,
  HealthOnBoardSchemaType,
  InsuranceCardType,
  InterviewFormSchemaType,
  JobAddSchemaType,
  JobApplySchemaType,
  JobPostSchemaType,
  JoinMeetingSchemaType,
  LabSchemaType,
  loginInput,
  logisticDetailsType,
  marketSchemaType,
  NationalIdCardType,
  NewJobInput,
  NursingCertificateType,
  PANCardType,
  PatientFormData,
  pucCardType,
  RefferalSchemaType,
  RegisterInput,
  RegistrationCertificatType,
  ResetPasswordInput,
  ReturnFormValues,
  storeDetailsSchemaType,
  testVideoSchemaType,
  UserInput,
  VehicleCatagoryType,
  VehiclePermitType
};

