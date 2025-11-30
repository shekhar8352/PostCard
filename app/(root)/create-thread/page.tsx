import { Suspense } from "react";
import PostThreadWrapper from "@/components/forms/PostThreadWrapper";
import Loading from "../loading";

async function Page() {
  return (
    <>
      <h1 className='head-text'>Create Card</h1>

      <Suspense fallback={<Loading />}>
        <PostThreadWrapper />
      </Suspense>
    </>
  );
}

export default Page;