import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROTO_PATH = join(__dirname, "proto", "hello.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: true,
  enums: String,
  defaults: true,
  oneofs: true,
});

const helloProto = grpc.loadPackageDefinition(packageDefinition).hello;

function sayHello(call, callback) {
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
