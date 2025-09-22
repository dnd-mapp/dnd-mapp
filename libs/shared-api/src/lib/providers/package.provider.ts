import { ClientProviderOptions, Transport } from '@nestjs/microservices';

export interface PackageInfo {
    clientName: string;
    packageName: string;
    protoDefinitionPath: string;
}

export function withPackage(packageInfo: PackageInfo): ClientProviderOptions {
    return {
        name: packageInfo.clientName,
        transport: Transport.GRPC,
        options: {
            package: packageInfo.packageName,
            protoPath: packageInfo.protoDefinitionPath,
        },
    };
}
