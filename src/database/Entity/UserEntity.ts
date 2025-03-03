import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { PostEntity } from "./PostEntity";

@Entity("users")
export class UserEntity extends BaseEntity {
  @Column({ type: "varchar", length: 30 })
  firstName!: string

  @Column({ type: "varchar", length: 30 })
  lastName!: string

  @Column({ type: "citext" })
  email!: string

  @OneToMany(() => PostEntity, post => post.author)
  posts!: PostEntity[];
}