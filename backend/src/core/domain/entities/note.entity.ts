export class Note {
  id: string;
  title: string | null;
  content: string;
  userId: string;
  occurrenceId: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    props: Omit<Note, "id" | "createdAt" | "updatedAt">,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id || crypto.randomUUID();
    this.title = props.title;
    this.content = props.content;
    this.userId = props.userId;
    this.occurrenceId = props.occurrenceId;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }
}
