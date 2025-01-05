import BgBlur from "@/components/common/BgBlur";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center py-16">
      <BgBlur>
        <SignUp />;
      </BgBlur>
    </div>
  );
}
