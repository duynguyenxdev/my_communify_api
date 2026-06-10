export class ConversationDto {
  id!: string;
  name?: string;
  participants!: {
    id: string;
    fullName?: string;
    avatar?: string;
  }[];
}
