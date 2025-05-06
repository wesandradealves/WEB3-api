import { Controller, Get, Query, Post, Body, Param, Patch, Inject } from '@nestjs/common';
import { CreateAdjunctDto } from '../dtos/create.adjunct.dto';
import { UpdateAdjunctDto } from '../dtos/update.adjunct.dto';
import { ICreateAdjunctUseCase } from '@/domain/interfaces/use-cases/adjunct/create.adjunct.use-case';
import { IListAllAdjunctsUseCase } from '@/domain/interfaces/use-cases/adjunct/list.all.adjunct.use-case';
import { IFindOneAdjunctUseCase } from '@/domain/interfaces/use-cases/adjunct/find.one.adjunct.use-case';
import { IUpdateAdjunctUseCase } from '@/domain/interfaces/use-cases/adjunct/update.adjunct.use-case';
import { IGetBdmUserByEmailUseCase } from '@/domain/interfaces/use-cases/adjunct/get.bdm.user.by.email.use-case';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Adjuncts')
@Controller('adjuncts')
export class AdjunctController {
  constructor(
    @Inject(ICreateAdjunctUseCase)
    private readonly createUseCase: ICreateAdjunctUseCase,

    @Inject(IListAllAdjunctsUseCase)
    private readonly listAllUseCase: IListAllAdjunctsUseCase,

    @Inject(IFindOneAdjunctUseCase)
    private readonly findOneUseCase: IFindOneAdjunctUseCase,

    @Inject(IUpdateAdjunctUseCase)
    private readonly updateUseCase: IUpdateAdjunctUseCase,

    @Inject(IGetBdmUserByEmailUseCase)
    private readonly getBdmUserByEmailUseCase: IGetBdmUserByEmailUseCase,
  ) {}

  @Get('bdm')
  @ApiOperation({
    summary: 'Get user data from BDM',
    description: 'Fetches user data from the BDM system using the provided email.',
  })
  async getBdmUserByEmail(@Query('email') email: string) {
    return this.getBdmUserByEmailUseCase.execute(email);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new adjunct',
    description: 'Registers a new adjunct linked to a representative.',
  })
  async create(@Body() dto: CreateAdjunctDto) {
    return this.createUseCase.execute(dto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Find one adjunct',
    description: 'Retrieves an adjunct by its ID.',
  })
  async findOne(@Param('id') id: string) {
    return this.findOneUseCase.execute(id);
  }

  @Get()
  @ApiOperation({
    summary: 'List all adjuncts',
    description: 'Retrieves a list of all adjuncts registered in the system.',
  })
  async findAll() {
    return this.listAllUseCase.execute();
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update adjunct surname',
    description: 'Updates the surname of an adjunct by its ID.',
  })
  async update(@Param('id') id: string, @Body() dto: UpdateAdjunctDto) {
    return this.updateUseCase.execute(id, dto);
  }
}
