import { Column, Entity, ManyToMany, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { UserEntity } from "./UserEntity";

@Entity("posts")
export class PostEntity extends BaseEntity {
  @Column({ type: "varchar", length: 25 })
  title!: string

  @Column({ type: "varchar", length: 50 })
  description!: string

  @Column({ type: "text" })
  text!: string

  @Column({ type: 'timestamp' })
  publishedAt!: Date

  @Column({type: "text", array: true, nullable: true})
  tags!: string[]

  @ManyToOne(() => UserEntity, user => user.posts)
  author!: UserEntity
}