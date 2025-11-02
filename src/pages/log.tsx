import { ImageCreatedList } from "../components/Imagepreview";
import { MenuAmburger } from "../components/menu";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
type imageStats = {
    success: number;
    failed: number;
    time: number | undefined;
    lastImage: string | undefined;
    status: boolean | undefined;
    total: number;
    date: Date;
    images: [
      {
        url: string;
        count: number;
        date: Date;
      }
    ];
  };
export function LogPage() {
  useDocumentTitle("Loggeurs");
  const defauftData = {
    success: 0,
    failed: 0,
    time: undefined,
    lastImage: undefined,
    status: undefined,
    total: 0,
    date: new Date(),
    images: []
  };
  // Pour l'exemple, nous utilisons des données statiques
  const stats: imageStats = JSON.parse(localStorage?.getItem("imageGPData") ? localStorage?.getItem("imageGPData") || ""  : JSON.stringify(defauftData))

  return (
    <>
      <MenuAmburger />
      <div className="container my-4">
        <h3 className="text-center mb-4">Tableau de Bord des Logs</h3>

        {/* Cartes des statistiques */}
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="card h-100 border-success">
              <div className="card-body text-center">
                <h5 className="card-title text-success">
                  Générations Réussies
                </h5>
                <p className="display-4 text-success">{stats.success}</p>
                <p className="text-muted">
                  ({((stats.success / stats.total) * 100).toFixed(1)}% de
                  succès)
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 border-danger">
              <div className="card-body text-center">
                <h5 className="card-title text-danger">Échecs de Génération</h5>
                <p className="display-4 text-danger">{stats.failed}</p>
                <p className="text-muted">
                  ({((stats.failed / stats.total) * 100).toFixed(1)}% d'échecs)
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-body text-center">
                <h5 className="card-title">Total des Générations</h5>
                <p className="display-4">{stats.total}</p>
                <p className="text-muted">Depuis le début</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dernière image générée */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Dernière Image Générée</h5>
              </div>
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-4">
                    <img
                      src={stats.lastImage}
                      alt="Dernière image générée"
                      className="img-fluid rounded shadow"
                    />
                  </div>
                  <div className="col-md-8">
                    <h6>Informations de génération</h6>
                    <table className="table table-sm">
                      <tbody>
                        <tr>
                          <td>Date de génération:</td>
                          <td>{stats?.date?.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td>Statut:</td>
                          <td>
                            <span
                              className={`badge ${
                                stats?.status ? "bg-success" : "bg-danger"
                              }`}
                            >
                              {stats?.status ? "Succès" : "Échec"}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>Temps de génération:</td>
                          <td>{stats?.time ? (stats?.time / 1000).toFixed(1) : 0} secondes</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h3>Génération précédente</h3>
        <ImageCreatedList images={[...stats?.images]?.reverse().map(img => img.url) || []} />
      </div>
    </>
  );
}
