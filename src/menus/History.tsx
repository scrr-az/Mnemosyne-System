import type { HistoryEntry } from "../common/HistoryTypes";
import "./History.css";

interface HistoryProps {
  entries: HistoryEntry[];
}

export default function History({ entries }: HistoryProps) {
  return (
    <div className="history-container">
      <p>HISTORY</p>

      <table className="history-table">
        <thead>
          <tr>
            <th>MEDIA</th>
            <th>MEMORY</th>
            <th>ORIGINALLY</th>
            <th>CHANGES</th>
            <th>RECOVER STATUS</th>
          </tr>
        </thead>

        <tbody>
          {entries.map(entry => (
            <tr key={entry.id}>

              {/* MEDIA */}
              <td>
                <div className="history-media">
                  {entry.itemType === "image" ? (
                    <>
                      <img src={entry.originalContent} alt="Original" />
                      <span>→</span>
                      <img src={entry.changedContent} alt="Changed" />
                    </>
                  ) : (
                    <>
                      <div className="text-placeholder" />
                      <span>→</span>
                      <div className="text-placeholder" />
                    </>
                  )}
                </div>
              </td>

              {/* MEMORY */}
              <td>
                {String(9-entry.memoryIdx).padStart(3, "0")}: IMG-
                {String(entry.itemId).padStart(3, "0")}
              </td>

              {/* ORIGINAL */}
              <td>{entry.originalContent}</td>

              {/* CHANGES */}
              <td>{entry.changedContent}</td>

              {/* RECOVER STATUS */}
              <td>
                {entry.recovered ? (
                  <span className="recovered">
                    Recovered
                    <br />
                    {entry.timestamp
                      ? new Date(entry.timestamp).toLocaleDateString()
                      : ""}
                  </span>
                ) : (
                  <span className="not-recovered">None</span>
                )}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}