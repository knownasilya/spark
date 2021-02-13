import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateAdminInput {
  @Field()
  name?: string;
}
