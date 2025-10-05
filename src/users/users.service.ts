import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './interface/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private users: User[] = [];

  async findAll(): Promise<User[]> {
    return this.users;
  }
  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }
  async findOneById(id: string): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }
  async create(userDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);

    const newUser: User = {
      id: uuidv4(),
      nombre: userDto.nombre,
      email: userDto.email,
      password: hashedPassword,
      fecha_creacion: new Date(),
    };

    this.users.push(newUser);
    return newUser;
  }

  async update(id: string, updateDto: UpdateUserDto): Promise<User> {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }

    const user = this.users[userIndex];
    let newPasswordHash = user.password;

    if (updateDto.password) {
      newPasswordHash = await bcrypt.hash(updateDto.password, 10);
    }

    const updatedUser: User = {
      ...user,
      ...updateDto,
      password: newPasswordHash,
    };

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const initialLength = this.users.length;
    this.users = this.users.filter(u => u.id !== id);
    if (this.users.length === initialLength) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }
  }
}
