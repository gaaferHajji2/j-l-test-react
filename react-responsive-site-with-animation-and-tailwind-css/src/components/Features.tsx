
import feature from '../assets/feature-01.png'

const Features = () => {
  return (
    <div className="my-24 md:px-14 px-4 max-w-screen-2xl mx-auto">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
        
        <div className="lg:w-1/4">
          <h3 className="text-3xl text-primary font-bold lg:w-1/2 mb-3">
            Why We Are Better Than Other
          </h3>
          <p className="text-base text-tartiary">
            This is A Simple Paragraph Sentence That Are Used In This Site. The
            First Sentence Used In Site Often Called "Topic Sentence"
          </p>
        </div>

        {/* Featured Cards */}

        <div className="w-full lg:w-3/4">
            <div>
                <div>
                    <img src={feature} alt="" className="w-52" />
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Features;
