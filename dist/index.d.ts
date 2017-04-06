import { Gateway } from './gateways/base';
export { FileSystemGateway } from './gateways/fileSystem';
export { RackspaceGateway } from './gateways/rackspace';
export { RegistryGateway } from './gateways/registry';
export declare function sync(sourceGateway: Gateway, destinationGateway: Gateway): Promise<void>;
