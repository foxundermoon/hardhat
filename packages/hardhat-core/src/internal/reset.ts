import { HardhatContext } from "./context";

export function resetHardhatContext() {
  if (HardhatContext.isCreated()) {
    const ctx = HardhatContext.getHardhatContext();

    if (ctx.environment !== undefined) {
      const globalAsAny = global as any;
      for (const key of Object.keys(ctx.environment)) {
        globalAsAny[key] = undefined;
      }
    }

    const filesLoadedDuringConfig = ctx.getFilesLoadedDuringConfig();
    filesLoadedDuringConfig.forEach(unloadModule);

    HardhatContext.deleteHardhatContext();
  }

  // Unload all the hardhat's entry-points.
  unloadModule("../register");
  unloadModule("./cli/cli");
  unloadModule("./lib/hardhat-lib");
}

function unloadModule(path: string) {
  try {
    delete require.cache[require.resolve(path)];
  } catch (err) {
    // module wasn't loaded
  }
}
