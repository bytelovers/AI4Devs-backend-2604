import { prisma } from '../../infrastructure/database/client';

export class WorkExperience {
  id?: number;
  company: string;
  position: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  candidateId?: number;

  constructor(data: any) {
    this.id = data.id;
    this.company = data.company;
    this.position = data.position;
    this.description = data.description;
    this.startDate = new Date(data.startDate);
    this.endDate = data.endDate ? new Date(data.endDate) : undefined;
    this.candidateId = data.candidateId;
  }

  async save() {
    const workExperienceData: any = {
      company: this.company,
      position: this.position,
      description: this.description,
      startDate: this.startDate,
      endDate: this.endDate,
    };

    if (this.candidateId !== undefined) {
      workExperienceData.candidateId = this.candidateId;
    }

    if (this.id) {
      // Update an existing work experience record
      return await prisma.workExperience.update({
        where: { id: this.id },
        data: workExperienceData,
      });
    } else {
      // Create a new work experience record
      return await prisma.workExperience.create({
        data: workExperienceData,
      });
    }
  }
}
