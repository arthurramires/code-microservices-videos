import { httpVideo } from "./index";
import httpResource from "./http-resource";

const categoryHttp = new httpResource(httpVideo, "categories");

export default categoryHttp;
