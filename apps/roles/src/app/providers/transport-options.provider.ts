import {
    ROLE_PACKAGE_NAME,
    ROLE_SERVICE_DEFINITION_PATH,
    ROLE_SERVICE_HOST,
    SCOPE_PACKAGE_NAME,
    SCOPE_SERVICE_DEFINITION_PATH,
} from '@dnd-mapp/shared-api';
import { Server } from '@grpc/grpc-js';
import { PackageDefinition } from '@grpc/proto-loader';
import { ReflectionService } from '@grpc/reflection';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { HealthImplementation, protoPath as healthCheckProtoPath } from 'grpc-health-check';
import { join } from 'path';

function addHealthCheckService(server: Server) {
    const healthCheckImplementation = new HealthImplementation({
        '': 'UNKNOWN',
    });

    healthCheckImplementation.addToServer(server);
    healthCheckImplementation.setStatus('', 'SERVING');
}

function addReflectionService(pkg: PackageDefinition, server: Server) {
    const reflectionService = new ReflectionService(pkg);
    reflectionService.addToServer(server);
}

function onLoadPackageDefinition(pkg: PackageDefinition, server: Server) {
    addReflectionService(pkg, server);
    addHealthCheckService(server);
}

export const transportOptionsProvider: GrpcOptions = {
    transport: Transport.GRPC,
    options: {
        gracefulShutdown: true,
        onLoadPackageDefinition: onLoadPackageDefinition,
        package: [ROLE_PACKAGE_NAME, SCOPE_PACKAGE_NAME],
        protoPath: [
            healthCheckProtoPath,
            join(__dirname, ROLE_SERVICE_DEFINITION_PATH),
            join(__dirname, SCOPE_SERVICE_DEFINITION_PATH),
        ],
        url: ROLE_SERVICE_HOST,
    },
};
