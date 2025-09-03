import { BeforeApplicationShutdown, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFile, stat } from 'fs/promises';
import * as juice from 'juice';
import { createTransport, Transporter } from 'nodemailer';
import type { Options } from 'nodemailer/lib/smtp-transport';
import { resolve } from 'path';
import { EmailSubject, getTemplateName, SendEmailParams } from '../shared';
import { TRANSPORTER_OPTIONS_NAME } from './providers';

@Injectable()
export class EmailService implements OnModuleInit, BeforeApplicationShutdown {
    private readonly transporter: Transporter;

    private readonly sender: string;

    private readonly baseTemplatesPath = resolve(__dirname, 'assets', 'mail');

    constructor(
        @Inject(TRANSPORTER_OPTIONS_NAME) private readonly transporterOptions: Options,
        private readonly configService: ConfigService
    ) {
        this.transporter = createTransport(this.transporterOptions);

        this.sender = this.configService.get<string>('email.sender');
    }

    public async onModuleInit() {
        await this.transporter.verify();
    }

    public beforeApplicationShutdown() {
        this.transporter.close();
    }

    public async sendEmail(params: SendEmailParams) {
        const { text, html } = await this.resolveEmailTemplateFromSubject(params.subject, params.data);

        // TODO: Add error handling
        await this.transporter.sendMail({
            from: this.sender,
            to: params.to,
            subject: params.subject,
            text: text,
            html: html,
        });
    }

    private async resolveEmailTemplateFromSubject(
        subject: EmailSubject,
        data: Record<string, string | boolean | number>
    ) {
        const templateName = getTemplateName(subject);

        const htmlTemplate = await this.retrieveEmailTemplate(
            resolve(this.baseTemplatesPath, 'html', `${templateName}.html`)
        );
        const textTemplate = await this.retrieveEmailTemplate(
            resolve(this.baseTemplatesPath, 'text', `${templateName}.txt`)
        );

        return {
            text: this.applyDataValues(textTemplate, data),
            html: juice(this.applyDataValues(htmlTemplate, data)),
        };
    }

    private async retrieveEmailTemplate(filePath: string) {
        await stat(filePath);
        return await readFile(filePath, 'utf8');
    }

    /**
     * Will go through the template string looking for `{{ $variableName }}` and replace that variableName with
     * the value of the key with the same name.
     */
    private applyDataValues(template: string, data: Record<string, string | boolean | number>) {
        Object.keys(data).forEach((key) => {
            template = template.replaceAll(`{{ $${key} }}`, `${data[key]}`);
        });

        return template;
    }
}
