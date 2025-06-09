// src/company/company.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name)
    private readonly companyModel: Model<CompanyDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>, // <--- inject User model
  ) {}

  async create(
    createCompanyDto: CreateCompanyDto,
    req: RequestWithUser,
  ): Promise<Company> {
    // // 👉 Check if user already has a company
    // const existingCompany = await this.companyModel.findOne({
    //   userId: createCompanyDto.userId,
    // });
    // if (existingCompany) {
    //   throw new NotFoundException(
    //     `Company for user ${createCompanyDto.userId} already exists`,
    //   );
    // }

    const createdCompany = new this.companyModel({
      ...createCompanyDto,
      userId: req.user.userId,
    });
    return createdCompany.save();
  }

  async findAll(req: RequestWithUser): Promise<Company[]> {
    return this.companyModel.find({ userId: req.user.userId }).exec();
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.companyModel
      .findById(id)
      .populate('userId')
      .exec();
    if (!company) {
      throw new NotFoundException(`Company with id ${id} not found`);
    }
    return company;
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    const updatedCompany = await this.companyModel
      .findByIdAndUpdate(id, updateCompanyDto, {
        new: true,
      })
      .exec();

    if (!updatedCompany) {
      throw new NotFoundException(`Company with id ${id} not found`);
    }

    return updatedCompany;
  }

  async remove(id: string): Promise<Company> {
    const deletedCompany = await this.companyModel.findByIdAndDelete(id).exec();
    if (!deletedCompany) {
      throw new NotFoundException(`Company with id ${id} not found`);
    }
    return deletedCompany;
  }
}
