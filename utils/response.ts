import { ResponseJson } from '#interfaces/response.interface';
import type { HttpContext } from '@adonisjs/core/http'

export default class ResponseBody {
  success: boolean;
  message: string;
  data?: object | array;

  constructor({ success = true, message = 'Success load data', data = null }) {
    this.success = success
    this.message = message
    this.data = data
  }

}
