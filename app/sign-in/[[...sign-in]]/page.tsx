import BgBlur from "@/components/common/BgBlur";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center py-16">
      <BgBlur>
        <SignIn />;
      </BgBlur>
    </div>
  );
}
