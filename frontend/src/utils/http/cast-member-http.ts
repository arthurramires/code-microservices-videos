import { httpVideo } from "./index";
import httpResource from "./http-resource";

const castMemberHttp = new httpResource(httpVideo, "cast_members");

export default castMemberHttp;
