import { client, getUserId, getUserLoginMethod } from "./axiosClient";

export function registerMobileProfile(body: any) {
  return client.post("auth/signup-mobile", body);
}

// {
//     "userName": "Manas1234",
//     "userEmail": "kumarmanas1234@gmail.com",
//     "password": "Manas@1234",
//     "dob": "1996-12-30",
//     "token": "token",
//     "contactSource": "SIGNUP",
//     "userDailyLifeCode": "DL-IND-123456789123",
//     "userStatus": "ACTIVE"
// }
export function registerProfile(body: any) {
  return client.post("auth/signup", body);
}

// {
//     "userName": "Manas1234",
//     "password": "Manas@1234",
//     "loginMethod": "WEB",
//     "userLoginDeviceName": "DESKTOP-eeee",
//     "userLoginDeviceIP": "127.0.0.1"
// }
export function login(body: any) {
  return client.post("auth/signin", body);
}

export function forgotPassword(body: any) {
  return client.patch("auth/forgot-password", body);
}

export function changePassword(body: any) {
  return client.patch("auth/change-password", body);
}

export function resetPassword(body: any) {
  return client.patch("auth/reset-password", body);
}

export function profileAvailability(body: any) {
  return client.post("auth/profile-availability", body);
}

export function invokePreviousLogin(body: any) {
  return client.post("auth/invoke-previous-login", body);
}

export function invokePreviousDevice(body: any) {
  return client.post("auth/insert-in-login-device-history", body);
}

export function addMember(body: any) {
  return client.post("auth/add-member", body);
}

export function getProfile() {
  return client.get("auth/profile");
}

export function getUserModuleRole(userId: number) {
  return client.get(
    `auth/get-role?userId=${userId}&userModuleRoleStatus=ACTIVE`
  );
}

export function updateProfileContact(body: any) {
  return client.patch("auth/update-profile-contact", body);
}

export function paginateUserDataFromTable(query: any, body: any) {
  return client.post(`auth/search-profile`, body, { params: query });
}

export function deleteUserProfile(query: any) {
  return client.delete(`auth/delete-profile`, { params: query });
}

export function insertDataInTable(tableName: string, body: any) {
  return client.post(`${tableName}/create`, body);
}

export function syncDataInTable(tableName: string, body: any, uniqueKey: any) {
  let onlyCheck = body?.onlyCheck;
  delete body?.onlyCheck;
  if (onlyCheck) {
    return client.post(`${tableName}/syncData`, body, {
      params: { uniqueKey: uniqueKey, onlyCheck },
    });
  }
  else {
    return client.post(`${tableName}/syncData`, body, {
      params: { uniqueKey: uniqueKey },
    });
  }
}

export function syncByTwoUniqueKeyData(
  tableName: string,
  body: any,
  uniqueKey: any,
  secondUniqueKey: any
) {
  return client.post(`${tableName}/syncByTwoUniqueKeyData`, body, {
    params: { uniqueKey, secondUniqueKey },
  });
}

export function syncByKeyArrayData(
  tableName: string,
  body: any,
  keyArr: any[]
) {
  return client.post(`${tableName}/syncByKeyArrayData`, body, {
    params: { keyArr: keyArr?.join('+') },
  });
}

export function insertBulkDataInTable(tableName: string, body: any[]) {
  return client.post(`${tableName}/insertMany`, body);
}

export function getOneDataFromTable(
  tableName: string,
  id: any,
  primeryKeyName: string
) {
  let query: any = {};
  query[primeryKeyName] = id;
  return client.get(`${tableName}/get-one-record`, { params: query });
}

export function searchDataFromTable(tableName: string, query: any) {
  return client.get(`${tableName}/search-one-record`, { params: query });
}

export function searchOneDataFromTableWithInclude(tableName: string, condition: any) {
  return client.post(`${tableName}/search-one-record-with-include`, condition);
}

export function searchListDataFromTableWithInclude(tableName: string, condition: any) {
  return client.post(`${tableName}/search-record-with-include`, condition);
}

export function searchListGroupDataFromTableWithInclude(tableName: string, condition: any) {
  return client.post(`${tableName}/search-group-record-with-include`, condition);
}

export function searchListDataFromTable(tableName: string, query: any) {
  return client.post(`${tableName}/get-all-record`, query);
}

export function searchOpenListDataFromTable(tableName: string, query: any) {
  return client.post(`${tableName}/get-all-open-record`, query);
}

export function getDataFromTable(tableName: string) {
  return client.post(`${tableName}/get-all-record`, {});
}

export function getDataFromTableCategory() {
  return client.get(`categorylist`);
}

export function getDataFromTableSubCategory() {
  return client.get(`subcategorylist`);
}

export function paginateDataFromTable(tableName: string, body: any) {
  return client.post(`${tableName}/search-record`, body);
}

export function updateByIdDataInTable(
  tableName: string,
  id: any,
  body: any,
  primeryKeyName: string
) {
  let query: any = {};
  query[primeryKeyName] = id;
  return client.patch(`${tableName}/update-record`, body, { params: query });
}


export function updateByCondDataInTable(
  tableName: string,
  query: any,
  body: any,
) {
  return client.patch(`${tableName}/sync-record`, body, { params: query });
}

export function deleteDataFromTable(
  tableName: string,
  id: any,
  primeryKeyName: string
) {
  let query: any = {};
  query[primeryKeyName] = id;
  return client.delete(`${tableName}/delete-record`, { params: query });
}

export function syncUserSkills(subCategoryId: number, payload: any) {
  return client.post(`trips/syncSkill/${subCategoryId}`, payload);
}

export function syncRiderGeo(payload: any) {
  return client.patch(`trips/update-geo`, payload);
}


export function makeDriverAvailable(payload: any) {
  return client.patch(`trips/makeDriverAvailable`, payload);
}

export function insertDataInTrip(body: any) {
  return client.post(`trips/addTrip`, body);
}

export function acceptTrip(tripId: number) {
  return client.get(`trips/acceptTrip/${tripId}`);
}

export function getTripList(body: any, query: any) {
  return client.post(`trips/getTripList`, body, { params: query });
}

export function validateCode(tripId: number, otp: any) {
  return client.get(`trips/validateCode/${tripId}/${otp}`);
}

export function endRide(tripId: number) {
  return client.get(`trips/endRide/${tripId}`);
}

export function UploadFile(driverId: number, body: any) {
  return client.post(`trips/upload/${driverId}`, body, { params: { folderName: 'DR/driver/driverImages' } });
}

export function UploadDoctorFile(doctorId: number, body: any) {
  return client.post(`appointment/upload/${doctorId}`, body, { params: { folderName: 'DS/doctor/doctorImages' } });
}

export function paginateDoctorFromTable(query: any, body: any) {
  return client.post(`appointment/getDoctorList`, body, { params: query });
}

export function getScheduleList(body: any, query: any) {
  return client.post(`appointment/getScheduleList`, body, { params: query });
}

export function uploadAudio(consultingId: number, body: any) {
  return client.post(`appointment/upload-audio/${consultingId}`, body, { params: { folderName: 'DS/patient/recordings' } });
}

export function onBoardProfessionalWithEntity(body: any, uniqueKey: string, secondUniqueKey: string) {
  return client.post(`appointment/onBoardProfessionalWithEntity`, body, { params: { uniqueKey, secondUniqueKey } });
}

export function searchListOfCartItems(query: any, moduleCode: string) {
  return client.get(`product/getCartItems`, { params: { ...query, moduleCode } });
}

export function getCartItemsCount(query: any, moduleCode: string) {
  return client.get(`product/getCartItemsCount`, { params: { ...query, moduleCode } });
}

export function getUserOrderItems(query: any, moduleCode: string) {
  return client.get(`product/getUserOrderItems`, { params: { ...query, moduleCode } });
}

export function getUserOrders(query: any, moduleCode: string) {
  return client.get(`product/getUserOrders`, { params: { ...query, moduleCode } });
}

export function getUserCurrentOrderItem(query: any, moduleCode: string) {
  return client.get(`product/getUserCurrentOrderItem`, { params: { ...query, moduleCode } });
}

export function sellerAccept(query: any, moduleCode: string) {
  return client.get(`product/sellerAccept`, { params: { ...query, moduleCode } });
}

export function sellerDispatch(query: any, moduleCode: string) {
  return client.get(`product/sellerDispatch`, { params: { ...query, moduleCode } });
}

export function logisticDelivered(query: any, moduleCode: string) {
  return client.get(`product/logisticDelivered`, { params: { ...query, moduleCode } });
}

export function returnOrder(orderItemId: any, body: any, moduleCode: string) {
  return client.post(`product/returnOrder`, body, { params: { orderItemId, moduleCode } });
}

export function cancelOrder(orderId: any, body: any, moduleCode: string) {
  return client.post(`product/cancelOrder`, body, { params: { orderId, moduleCode } });
}

export function placeOrder(payload: any, moduleCode: string) {
  return client.post(`product/placeOrder`, payload, { params: { moduleCode } });
}

export function getTopBrands(payload: any) {
  return client.post(`product/getTopBrands`, payload);
}

export async function logout(path: string) {
  if (getUserId() !== 0) {
    await client.patch(
      `auth/signOut`,
      { userId: getUserId(), loginMethod: getUserLoginMethod(), }
    );
    localStorage.clear();
    location.href = "/" + path;
  }
  else {
    location.href = "/" + path;
  }
}

export async function SSOlogout() {
  if (getUserId() !== 0) {
    await client.patch(
      `auth/signOut`,
      { userId: getUserId(), loginMethod: getUserLoginMethod(), }
    );
    localStorage.clear();
    window.location.reload();
  }
  else {
    window.location.reload();
  }
}

export async function logoutAnyNomous(path: string) {
  localStorage.clear();
  location.href = "/" + path;
}

export function UploadFileInTable(tableName: string, query: any, body: any) {
  return client.post(`${tableName}/uploadFile`, body, { params: query });
}

export function UploadAuthFile(body: any) {
  return client.post(`auth/uploadfile`, body);
}


export function addOrUpdateProduct(body: any, query: any, moduleCode: string) {
  return client.put("product/detectChangeInProductPrice", body, { params: { uniqueKey: query, moduleCode } });
}


export function getProductList(body: any, moduleCode: string) {
  return client.post("product/getProductList", body, { params: { moduleCode } });
}


export function addOrUpdateProductInCart(body: any, query: any, moduleCode: string) {
  return client.put("product/detectCartAction", body, { params: { uniqueKey: query, moduleCode } });
}

export function getAllAnswers(condition: any) {
  return client.post(`education/getAllAnswers`, condition);
}

export function getAllAnswerComments(condition: any) {
  return client.post(`education/getAllAnswerComments`, condition);
}

export function addQnA(payload: any) {
  return client.post(`education/addQnA`, payload);
}

export function syncActionOnAnswer(payload: any, uniqueKey: any, secondUniqueKey: any) {
  return client.post(`education/syncActionOnAnswer`, payload, {
    params: { uniqueKey, secondUniqueKey },
  });
}

export function getAllLobbyParticipants(condition: any) {
  return client.post(`education/getAllLobbyParticipants`, condition);
}

export function getAllOutsideLobbyParticipants(condition: any) {
  return client.post(`education/getAllOutsideLobbyParticipants`, condition);
}

export async function getAiAnswer(payload: any) {
  let response = await client.post(`ai/getAiAnswer`, payload);
  if (response?.data?.code === "ERR_BAD_REQUEST") {
    return "I didn't understand that.";
  }
  else {
    return response.data;
    // const reader = response.data.getReader(); // Get the reader from the response body
    // const decoder = new TextDecoder();
    // let storyText = '';
  
    // // Read the stream in chunks and build the story as it streams
    // while (true) {
    //   const { done, value } = await reader.read();
    //   if (done) break; // End of stream
  
    //   const chunk = decoder.decode(value, { stream: true });
    //   storyText += response.data; 
    // }
    // return storyText;
  }
}

// export function giveMarksToAiAnswer(payload: any) {
//   return client.post(`ai/giveMarksToAiAnswer`, payload);
// }

export function getProfileScore(payload: any) {
  return client.post(`education/getProfileScore`, payload);
}

export function getStudentAnalytics(payload: any) {
  return client.get(`education/getStudentAnalytics`, { params: { ...payload } });

}

// export function getUserAiScore(payload: any) {
//   return client.post(`ai/getUserAiScore`, payload);
// }

export function getUserAnswerFromAi(payload: any) {
  return client.post(`ai/getUserAnswerFromAi`, payload);
}

// export function getUserAnswerFromAiThroughJson(payload: any) {
//   return client.post(`ai/getUserAnswerFromAiThroughJson`, payload);
// }

export function getUserAnswerFromAiThroughPdf(payload: any) {
  return client.post(`ai/getUserAnswerFromAiThroughPdf`, payload);
}

export function makeMeOnlineForSelectedTopic(payload: any) {
  return client.patch(`education/makeMeOnlineForSelectedTopic`, payload);
}

export function g2iRegister(payload: any) {
  return client.post(`education/g2iRegister`, payload);
}

export function g2iRegisterMobile(payload: any) {
  return client.post(`education/g2iRegister-mobile`, payload);
}

export function getRandomQuestions(query: any) {
  return client.get(`brQuestionSets/getRandomQuestions`, { params: query });
}

