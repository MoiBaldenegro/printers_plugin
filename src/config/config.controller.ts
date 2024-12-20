import { Controller, Get, NotFoundException } from '@nestjs/common';
import { Post, Body } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

@Controller('config')
export class ConfigController {
  @Post('create-config')
  async createConfig(@Body() data: any) {
    const filePath = path.join(process.cwd(), 'devicerc.json');

    try {
      await fs.access(filePath);
      return { message: 'El archivo ya existe.' };
    } catch (error) {
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
      return { message: 'Archivo creado correctamente.' };
    }
  }

  @Get()
  async getConfig() {
    try {
      const data = await fs.readFile('./devicerc.json', 'utf-8');
      return data;
    } catch (error) {
      throw new NotFoundException('No se encontro el archivo.');
    }
  }

  @Post('update-config')
  async updateConfig(@Body() data: any) {
    const filePath = path.join(process.cwd(), 'devicerc.json');
    try {
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
      return { message: 'Archivo actualizado correctamente.' };
    } catch (error) {
      throw new NotFoundException('No se pudo actualizar');
    }
  }
}
