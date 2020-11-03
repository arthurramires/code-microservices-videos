import { httpVideo } from "./index";
import httpResource from "./http-resource";

const genreHttp = new httpResource(httpVideo, "genres");

export default genreHttp;
