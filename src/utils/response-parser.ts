import { Response } from 'express';
import { HTTP_STATUS } from '../config/http-status';
import { ApiResponse } from 'response-parser.types';

export class ResponseParser {
  private httpCode: number;
  private status: boolean;
  private message?: string;
  private body?: any;

  /**
   * Constructor with default success response values
   */
  constructor() {
    this.httpCode = HTTP_STATUS.OK;
    this.status = true; // success by default
    this.message = undefined;
    this.body = undefined;
  }

  /**
   * Set the HTTP status code
   */
  setHttpCode(code: number): this {
    this.httpCode = code;
    return this;
  }

  /**
   * Set the response status (true for success, false for error)
   */
  setStatus(status: boolean): this {
    this.status = status;
    return this;
  }

  /**
   * Set the response message
   */
  setMessage(message: string): this {
    this.message = message;
    return this;
  }

  /**
   * Set the response body/data
   */
  setBody(body: any): this {
    this.body = body;
    return this;
  }

  /**
   * Send the response
   */
  send(res: Response): Response {
    const response: ApiResponse = {
      status: this.status ? 'success' : 'error',
    };

    if (this.message) {
      response.message = this.message;
    }

    if (this.body !== undefined) {
      response.data = this.body;
    }

    return res.status(this.httpCode).json(response);
  }
}