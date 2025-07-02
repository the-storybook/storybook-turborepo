import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { UUID } from 'crypto';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({timestamps: true, autoCreate: true, autoIndex: true})
export class User {

    @Prop({ required: true, unique: true, type: String })
    id: UUID;

    @Prop({ required: true })
    name: string;
    
    @Prop({ required: true, unique: true })
    email: string;
    
    @Prop({ required: true })
    password: string;

    version: number;

    verified: boolean;
    
}

export const UserSchema = SchemaFactory.createForClass(User);