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

function main() {
  const client = new helloProto.Greeter(
    "localhost:50051",
    grpc.credentials.createInsecure()
  );

  client.SayHello({ name: "Teste" }, (err, response) => {
    if (err) {
      console.log("Error:", err);
    }
    console.log("Response:", response.message);
  });
}

main();
