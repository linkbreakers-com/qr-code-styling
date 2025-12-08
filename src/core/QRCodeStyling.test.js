import QRCodeStyling from "./QRCodeStyling";
import fs from "fs";
import path from "path";
import * as nodeCanvas from "@napi-rs/canvas";
import { JSDOM } from "jsdom";

jest.setTimeout(20000);

describe("Test QRCodeStyling class", () => {
  beforeAll(() => {
    document.body.innerHTML = "<div id='container'></div>";
  });

  it("The README example should work correctly", async () => {
    const qrCode = new QRCodeStyling({
      type: "svg",
      width: 300,
      height: 300,
      data: "TEST",
      dotsOptions: {
        color: "#4267b2",
        type: "rounded"
      },
      backgroundOptions: {
        color: "#e9ebee"
      }
    });
    document.body.innerHTML = "<div id='container'></div>";

    const container = document.getElementById("container");

    qrCode.append(container);

    const element = await qrCode._getElement("svg");
    expect(element?.tagName?.toLowerCase()).toBe("svg");
    expect(container?.contains(element)).toBe(true);
  });

  it("Compatible with node-canvas", () =>
    new Promise((done) => {
      const expectedQRCodeFile = fs.readFileSync(
        path.resolve(__dirname, "../assets/test/image_from_readme.png"),
        "base64"
      );
      const qrCode = new QRCodeStyling({
        nodeCanvas,
        width: 300,
        height: 300,
        data: "TEST",
        image:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAEUlEQVR42mNk+M+AARiHsiAAcCIKAYwFoQ8AAAAASUVORK5CYII=",
        dotsOptions: {
          color: "#4267b2",
          type: "rounded"
        },
        backgroundOptions: {
          color: "#e9ebee"
        }
      });
      qrCode.getRawData("png").then((buffer) => {
        expect(Buffer.isBuffer(buffer)).toBe(true);
        const uri = `data:image/png;base64,${buffer.toString("base64")}`;
        expect(uri.startsWith("data:image/png;base64,iVBORw0KGgo")).toBe(true);
        done();
      });
    }));

  it("Compatible with jsdom", () =>
    new Promise((done) => {
      const qrCode = new QRCodeStyling({
        jsdom: JSDOM,
        nodeCanvas,
        type: "svg",
        width: 300,
        height: 300,
        data: "TEST",
        image:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAQAAAAnOwc2AAAAEUlEQVR42mNk+M+AARiHsiAAcCIKAYwFoQ8AAAAASUVORK5CYII=",
        dotsOptions: {
          color: "#4267b2",
          type: "rounded"
        },
        backgroundOptions: {
          color: "#e9ebee"
        },
        imageOptions: {
          saveAsBlob: false
        }
      });
      qrCode.getRawData("svg").then((buffer) => {
        const svgString = buffer.toString("utf-8");
        expect(svgString).toContain("<svg");
        expect(svgString).toContain('width="300"');
        done();
      });
    }));
});
