export class successResDto {
  statusCode: string;
  data: any;
  constructor(partial: Partial<successResDto>) {
    Object.assign(this, partial);
  }
}
