// --- V3 Telemetry Specification Alignment ---

declare let Telemetry: any;
declare let AuthTokenGenerate: any;

const telemetryData: {
  mobile: string;
  username: string;
  email: string;
  role: string;
  farmer_id: string;
  unique_id: string;
  registered_location: { district: string; village: string; taluka: string; lgd_code: string; };
  device_location: { district: string; village: string; taluka: string; lgd_code: string; };
  agristack_location: { district: string; village: string; taluka: string; lgd_code: string; };
} = {
  mobile: '',
  username: '',
  email: '',
  role: '',
  farmer_id: '',
  unique_id: '',
  registered_location: { district: '', village: '', taluka: '', lgd_code: '' },
  device_location: { district: '', village: '', taluka: '', lgd_code: '' },
  agristack_location: { district: '', village: '', taluka: '', lgd_code: '' }
};

export const setTelemetryUserData = (userData: any) => {
  telemetryData.mobile = userData.mobile || '';
  telemetryData.username = userData.username || '';
  telemetryData.email = userData.email || '';
  telemetryData.role = userData.role || '';
  telemetryData.farmer_id = userData.farmer_id || '';
  telemetryData.unique_id = userData.unique_id !== undefined ? String(userData.unique_id) : '';
  
  if (Array.isArray(userData.locations)) {
    userData.locations.forEach((location: any) => {
      const locData = {
        district: location.district || '',
        village: location.village || '',
        taluka: location.taluka || '',
        lgd_code: location.lgd_code !== undefined ? String(location.lgd_code) : ''
      };
      
      if (location.location_type === 'registered_location') telemetryData.registered_location = locData;
      else if (location.location_type === 'device_location') telemetryData.device_location = locData;
      else if (location.location_type === 'agristack_location') telemetryData.agristack_location = locData;
    });
  }
};

const getHostUrl = (): string => typeof window !== 'undefined' ? window.location.origin : 'unknown-host';

export const startTelemetry = (sessionId: string, userDetailsObj: { preferred_username: string; email: string }) => {
    if (typeof Telemetry === 'undefined') return;
    const key = "gyte5565fdbgbngfnhgmnhmjgm,jm,";
    const secret = "gnjhgjugkk";
    const config = {
      pdata: { id: "AmulAI", ver: "v0.1", pid: "AmulAI" },
      channel: "AmulAI-" + getHostUrl(),
      sid: sessionId,
      uid: userDetailsObj['preferred_username'] || "DEFAULT-USER",
      did: userDetailsObj['email'] || "DEFAULT-USER",
      authtoken: AuthTokenGenerate.generate(key, secret),
      host: "/observability-service",
    }
    Telemetry.start(config, "content_id", "contetn_ver", {}, {});
};

export const logQuestionEvent = (questionId: string, sessionId: string, questionText: string) => {
  if (typeof Telemetry === 'undefined') return;
  const target = {
    "id": "default", "ver": "v0.1", "type": "Question",
    "parent": { "id": "p1", "type": "default" },
    "questionsDetails": { "questionText": questionText, "sessionId": sessionId },
    "mobile": telemetryData.mobile, "username": telemetryData.username, "email": telemetryData.email,
    "role": telemetryData.role, "farmer_id": telemetryData.farmer_id, "unique_id": telemetryData.unique_id,
    "registered_location_district": telemetryData.registered_location?.district,
    "registered_location_village": telemetryData.registered_location?.village,
    "registered_location_taluka": telemetryData.registered_location?.taluka,
    "registered_location_lgd_code": telemetryData.registered_location?.lgd_code,
    "device_location_district": telemetryData.device_location?.district,
    "device_location_village": telemetryData.device_location?.village,
    "device_location_taluka": telemetryData.device_location?.taluka,
    "device_location_lgd_code": telemetryData.device_location?.lgd_code,
    "agristack_location_district": telemetryData.agristack_location?.district,
    "agristack_location_village": telemetryData.agristack_location?.village,
    "agristack_location_taluka": telemetryData.agristack_location?.taluka,
    "agristack_location_lgd_code": telemetryData.agristack_location?.lgd_code
  };
  Telemetry.response({ qid: questionId, type: "CHOOSE", target, sid: sessionId, channel: "AmulAI-" + getHostUrl() });
};

export const logResponseEvent = (questionId: string, sessionId: string, questionText: string, responseText: string) => {
  if (typeof Telemetry === 'undefined') return;
  const target = {
    "id": "default", "ver": "v0.1", "type": "QuestionResponse",
    "parent": { "id": "p1", "type": "default" },
    "questionsDetails": { "questionText": questionText, "answerText": responseText, "sessionId": sessionId },
    "mobile": telemetryData.mobile, "username": telemetryData.username, "email": telemetryData.email,
    "role": telemetryData.role, "farmer_id": telemetryData.farmer_id, "unique_id": telemetryData.unique_id,
    "registered_location_district": telemetryData.registered_location?.district,
    "registered_location_village": telemetryData.registered_location?.village,
    "registered_location_taluka": telemetryData.registered_location?.taluka,
    "registered_location_lgd_code": telemetryData.registered_location?.lgd_code,
    "device_location_district": telemetryData.device_location?.district,
    "device_location_village": telemetryData.device_location?.village,
    "device_location_taluka": telemetryData.device_location?.taluka,
    "device_location_lgd_code": telemetryData.device_location?.lgd_code,
    "agristack_location_district": telemetryData.agristack_location?.district,
    "agristack_location_village": telemetryData.agristack_location?.village,
    "agristack_location_taluka": telemetryData.agristack_location?.taluka,
    "agristack_location_lgd_code": telemetryData.agristack_location?.lgd_code
  };
  Telemetry.response({ qid: questionId, type: "CHOOSE", target, sid: sessionId, channel: "AmulAI-" + getHostUrl() });
};

export const logErrorEvent = (questionId: string, sessionId: string, error: string) => {
  if (typeof Telemetry === 'undefined') return;
  const target = {
    "id": "default", "ver": "v0.1", "type": "Error",
    "parent": { "id": "p1", "type": "default" },
    "errorDetails": { "errorText": error, "sessionId": sessionId },
    "mobile": telemetryData.mobile, "username": telemetryData.username, "email": telemetryData.email,
    "role": telemetryData.role, "farmer_id": telemetryData.farmer_id, "unique_id": telemetryData.unique_id,
    "registered_location_district": telemetryData.registered_location?.district,
    "registered_location_village": telemetryData.registered_location?.village,
    "registered_location_taluka": telemetryData.registered_location?.taluka,
    "registered_location_lgd_code": telemetryData.registered_location?.lgd_code,
    "device_location_district": telemetryData.device_location?.district,
    "device_location_village": telemetryData.device_location?.village,
    "device_location_taluka": telemetryData.device_location?.taluka,
    "device_location_lgd_code": telemetryData.device_location?.lgd_code,
    "agristack_location_district": telemetryData.agristack_location?.district,
    "agristack_location_village": telemetryData.agristack_location?.village,
    "agristack_location_taluka": telemetryData.agristack_location?.taluka,
    "agristack_location_lgd_code": telemetryData.agristack_location?.lgd_code
  };  
  Telemetry.response({ qid: questionId, type: "CHOOSE", target, sid: sessionId, channel: "AmulAI-" + getHostUrl() });
};

export const logFeedbackEvent = (questionId: string, sessionId: string, feedbackText: string, feedbackType: string, questionText: string, responseText: string) => {
  if (typeof Telemetry === 'undefined') return;
  const target = {
    "id": "default", "ver": "v0.1", "type": "Feedback",
    "parent": { "id": "p1", "type": "default" },
    "feedbackDetails": { feedbackText, sessionId, questionText, answerText: responseText, feedbackType },
    "mobile": telemetryData.mobile, "username": telemetryData.username, "email": telemetryData.email,
    "role": telemetryData.role, "farmer_id": telemetryData.farmer_id, "unique_id": telemetryData.unique_id,
    "registered_location_district": telemetryData.registered_location?.district,
    "registered_location_village": telemetryData.registered_location?.village,
    "registered_location_taluka": telemetryData.registered_location?.taluka,
    "registered_location_lgd_code": telemetryData.registered_location?.lgd_code,
    "device_location_district": telemetryData.device_location?.district,
    "device_location_village": telemetryData.device_location?.village,
    "device_location_taluka": telemetryData.device_location?.taluka,
    "device_location_lgd_code": telemetryData.device_location?.lgd_code,
    "agristack_location_district": telemetryData.agristack_location?.district,
    "agristack_location_village": telemetryData.agristack_location?.village,
    "agristack_location_taluka": telemetryData.agristack_location?.taluka,
    "agristack_location_lgd_code": telemetryData.agristack_location?.lgd_code
  };
  Telemetry.response({ qid: questionId, type: "CHOOSE", target, sid: sessionId, channel: "AmulAI-" + getHostUrl() });
};

export const endTelemetry = () => {
  if (typeof Telemetry !== 'undefined') Telemetry.end({});
};
