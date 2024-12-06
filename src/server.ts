import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { GreeterService, HelloReply, HelloRequest } from "./proto/interface";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROTO_PATH = join(__dirname, "proto", "hello.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  enums: String,
  defaults: true,
  oneofs: true,
});

const helloProto = grpc.loadPackageDefinition(packageDefinition)
  .hello as grpc.GrpcObject & {
  Greeter: {
    service: grpc.ServiceDefinition<GreeterService>;
  };
};

function sayHello(
  call: grpc.ServerUnaryCall<HelloRequest, HelloReply>,
  callback: grpc.sendUnaryData<HelloReply>
): void {
  const responseMessage = `Hello, ${call.request.name}!`;
  callback(null, { message: responseMessage });
}

function main() {
  const server = new grpc.Server();
  server.addService(helloProto.Greeter.service, { SayHello: sayHello });
  server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    () => {
      console.log("Servidor gRPC rodando em http://localhost:50051");
    }
  );
}

main();
