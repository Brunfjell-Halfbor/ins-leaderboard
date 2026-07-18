import { Link } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";

import { FaDiscord } from "react-icons/fa";
import tugImage from "../../assets/images/tug.png";
import infoImg from "../../assets/images/ins-default.jpg";
import statsImg from "../../assets/images/ins-default.jpg";
import workshopImg from "../../assets/images/ins-default.jpg";
import insBg from "../../assets/images/ins1.jpg";

function QuickCard({ title, desc, image, to }) {
  return (
    <Link to={to}>
      <div className="card bg-base-100 shadow-xl hover:scale-[1.02] transition duration-200">
        <figure>
          <img src={image} alt={title} />
        </figure>

        <div className="card-body bg-base-100">
          <h2 className="card-title">{title}</h2>
          <p className="text-sm opacity-70">{desc}</p>

          <div className="card-actions justify-end mt-2">
            <button className="btn btn-primary btn-sm">
              Open
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  return (
    <PageContainer>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2">
        <div className="lg:col-span-8">
          <div 
            className="hero min-h-75"
          >
            <div className="hero-content flex-col lg:flex-row p-6 relative z-10">

              {/* IMAGE */}
              <img
                src={tugImage}
                alt="TUG Insurgency banner"
                className="w-75 max-w-md lg:max-w-lg object-cover"
              />

              {/* TEXT */}
              <div className="text-center lg:text-left max-w-2xl text-white">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                  Welcome to the TUG Insurgency Community!
                </h2>

                <div className="divider divider-warning my-4"></div>

                <p className="mt-3 opacity-90">
                  TUG was born after the old Tuggerhosting servers shut down in late 2020.
                </p>

                <p className="mt-3 opacity-90">
                  While not a drop-in replacement for Tuggerhosting, our aim was to provide a similar experience while also updating theater items and maintaining active administrative presence through player empowerment.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div 
            className="hero min-h-75 h-full"
          >
            <div className="hero-content flex flex-col items-start justify-center p-6 relative z-10 h-full">

              <div className=" text-white">
                <FaDiscord className="w-16 h-16 mb-4 fill-current text-[#5865F2]" />

                <h3 className="text-2xl font-bold">Join the Community</h3>
                <p className="mt-2 opacity-90">
                  Connect with fellow players on Discord
                </p>

                <a href="https://discord.gg/jAavRHsnH"  target="_blank" rel="noopener noreferrer">
                  <button className="btn btn-primary mt-6">
                    Join Discord
                  </button>
                </a>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* QUICK ACCESS */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <QuickCard
          title="Leaderboards"
          desc="Kills and player rankings"
          image={statsImg}
          to="/leaderboards"
        />

        <QuickCard
          title="Rules"
          desc="Everything you need to know before playing"
          image={infoImg}
          to="/rules"
        />

        <QuickCard
          title="Help"
          desc="Browse guides, maps, collections, and mods"
          image={workshopImg}
          to="/help"
        />
        
      </div>

    </PageContainer>
  );
}