import grpc from "@grpc/grpc-js";

export interface HelloRequest {
  name: string;
}

export interface HelloReply {
  message: string;
}

export interface GreeterService extends grpc.UntypedServiceImplementation {
  SayHello: grpc.handleUnaryCall<HelloRequest, HelloReply>;
}

export interface GreeterClient extends grpc.Client {
  SayHello(
    request: HelloRequest,
    callback: (error: grpc.ServiceError | null, response: HelloReply) => void
  ): void;
}
