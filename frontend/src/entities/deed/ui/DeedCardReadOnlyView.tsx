import type { DeedPublic } from "../model/types";
import { DeedCardContent } from "./DeedCardContent";

export function DeedCardReadOnlyView({ deed }: { deed: DeedPublic }) {
  return <DeedCardContent deed={deed} />;
}
