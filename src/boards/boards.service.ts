import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardEntity } from './entities/board.entity';
import { throwError } from 'rxjs';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(BoardEntity)
    private boardEntityRepository: Repository<BoardEntity>,
  ) {}

  async create(createBoardDto: CreateBoardDto) {
    const newBoard = this.boardEntityRepository.create(
      createBoardDto as DeepPartial<BoardEntity>,
    );
    try {
      await this.boardEntityRepository.save(newBoard);
    } catch (error) {
      return throwError(() => new Error('Failed to create board'));
    }
    return newBoard;
  }

  findAll() {
    return this.boardEntityRepository.find();
  }

  findOne(id: number) {
    return this.boardEntityRepository.findOneBy({ id });
  }

  async update(id: number, updateBoardDto: UpdateBoardDto) {
    const existingBoard = await this.boardEntityRepository.findOneBy({ id });
    if (!existingBoard) {
      throw new Error('Board not found');
    }
    const updatedBoard = Object.assign(existingBoard, updateBoardDto);
    return this.boardEntityRepository.save(updatedBoard);
  }

  remove(id: number) {
    return this.boardEntityRepository.delete(id);
  }
}
