import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeleteResult {
  @Field()
  ok: boolean;
}

@ObjectType()
export class Point {
  @Field()
  type: 'Point';

  @Field(() => [Float])
  coordinates: number[];
}
