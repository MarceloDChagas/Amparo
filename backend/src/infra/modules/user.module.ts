import { Module } from "@nestjs/common";

import { DeleteUserUseCase } from "@/core/use-cases/user/delete-user.use-case";
import { GetUserUseCase } from "@/core/use-cases/user/get-user.use-case";
import { UpdateUserUseCase } from "@/core/use-cases/user/update-user.use-case";
import { UserController } from "@/infra/http/controllers/user.controller";
import { AuthModule } from "@/infra/modules/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [GetUserUseCase, UpdateUserUseCase, DeleteUserUseCase],
  exports: [GetUserUseCase],
})
export class UserModule {}
