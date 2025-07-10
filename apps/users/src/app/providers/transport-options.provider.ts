import { USER_PACKAGE_NAME, USER_SERVICE_DEFINITION_PATH, USER_SERVICE_HOST } from '@dnd-mapp/shared-api';
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
        package: USER_PACKAGE_NAME,
        protoPath: [healthCheckProtoPath, join(__dirname, USER_SERVICE_DEFINITION_PATH)],
        url: USER_SERVICE_HOST,
    },
};
