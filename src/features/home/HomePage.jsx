import { Link } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";

import tugImage from "../../assets/images/tug.png";
import infoImg from "../../assets/images/ins-default.jpg";
import statsImg from "../../assets/images/ins-default.jpg";
import workshopImg from "../../assets/images/ins-default.jpg";

function QuickCard({ title, desc, image, to }) {
  return (
    <Link to={to}>
      <div className="card bg-base-100 image-full shadow-xl hover:scale-[1.02] transition duration-200">
        <figure>
          <img src={image} alt={title} />
        </figure>

        <div className="card-body justify-end bg-linear-to-t from-black/90 via-black/40 to-transparent">
          <h2 className="card-title text-white">{title}</h2>
          <p className="text-gray-200 text-sm">{desc}</p>

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

      {/* HERO */}
      <div className="hero mt-2">
        <div className="hero-content flex-col lg:flex-row">

          {/* IMAGE */}
          <img
            src={tugImage}
            alt="TUG Insurgency banner"
            className="w-75 max-w-md lg:max-w-lg object-cover"
          />

          {/* TEXT */}
          <div className="text-center lg:text-left max-w-2xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Welcome to the TUG Insurgency Community!
            </h2>

            <div className="divider divider-warning my-4"></div>

            <p className="mt-3 opacity-70">
              TUG was born after the old Tuggerhosting servers shut down in late 2020.
            </p>

            <p className="mt-3 opacity-70">
              While not a drop-in replacement for Tuggerhosting, our aim was to provide a similar experience while also updating theater items and maintaining active administrative presence through player empowerment.
            </p>
          </div>
        </div>
      </div>

      {/* QUICK ACCESS */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <QuickCard
          title="Info Hub"
          desc="Servers, rules, admins, Discord & help"
          image={infoImg}
          to="/servers"
        />

        <QuickCard
          title="Stats & Leaderboards"
          desc="Kills, medics, weapons & player rankings"
          image={statsImg}
          to="/leaderboards"
        />

        <QuickCard
          title="Workshop"
          desc="Maps, collections & custom content"
          image={workshopImg}
          to="/collection"
        />

      </div>

    </PageContainer>
  );
}