import { IDashboardFileProcessorRepository } from "@/domain/repositories/dashboard-file-processor/dashboard-file.processor.repository";
import { Controller, Get, Inject } from "@nestjs/common";

@Controller('dashboard')
export class DashboardFileProcessorController {
  constructor(
    @Inject(IDashboardFileProcessorRepository)
    private readonly dashboardFileProcessorRepository: IDashboardFileProcessorRepository,
  ) {}

  @Get('file-transfer')
  async get(): Promise<any> {
    return this.dashboardFileProcessorRepository.fileProcessor();
  }
}
