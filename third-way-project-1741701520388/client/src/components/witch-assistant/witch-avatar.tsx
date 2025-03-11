import { WitchCustomization, FamiliarType, HeadAccessory, HandAccessory, BodyAccessory } from "@shared/schema";
import { motion } from "framer-motion";
import { useState } from "react";

const FAMILIAR_SOUNDS: Record<FamiliarType, string> = {
  bat: "squeak squeak!",
  toad: "ribbit!",
  moth: "flutter!",
  beetle: "buzz!",
  cat: "meow!",
  dog: "woof!",
  goat: "baah!",
};

interface WitchAvatarProps {
  customization: WitchCustomization;
  isAnimating?: boolean;
}

export function WitchAvatar({ customization, isAnimating = false }: WitchAvatarProps) {
  const { appearance } = customization;
  const [showSound, setShowSound] = useState(false);

  const handleClick = () => {
    setShowSound(true);
    setTimeout(() => setShowSound(false), 1000);
  };

  const renderBodyAccessories = (accessories: BodyAccessory[] = []) => {
    const accessoryPaths: Record<BodyAccessory, JSX.Element> = {
      magic_cloak: (
        <path
          d="M20 40 Q50 70 80 40"
          fill="none"
          stroke="#6a1b9a"
          strokeWidth="4"
          opacity="0.8"
        />
      ),
      herb_pouch: (
        <g transform="translate(70, 45)">
          <path d="M0 0 Q0 10 -5 10 L5 10 Q0 10 0 0" fill="#8b4513"/>
          <circle cx="0" cy="5" r="1" fill="#90ee90"/>
        </g>
      ),
      amulet_necklace: (
        <g>
          <circle cx="50" cy="45" r="3" fill="#ff1744" />
          <path
            d="M35 40 Q50 50 65 40"
            fill="none"
            stroke="#ffd700"
            strokeWidth="1"
          />
        </g>
      ),
    };

    return accessories.map((accessory, index) => (
      <g key={`${accessory}-${index}`}>
        {accessoryPaths[accessory]}
      </g>
    ));
  };

  const renderHeadAccessory = (accessoryId: HeadAccessory | null) => {
    if (!accessoryId) return null;

    const accessoryPaths: Record<HeadAccessory, JSX.Element> = {
      witch_hat: (
        <g transform="translate(0, -20)">
          <path
            d="M35 20 L50 0 L65 20 L35 20"
            fill="#1a1a1a"
            stroke="#333"
            strokeWidth="2"
          />
          <path
            d="M30 20 L70 20"
            fill="none"
            stroke="#333"
            strokeWidth="2"
          />
        </g>
      ),
      wizard_hat: (
        <g transform="translate(0, -20)">
          <path
            d="M40 20 C45 0 55 0 60 20"
            fill="#4a148c"
            stroke="#6a1b9a"
            strokeWidth="2"
          />
          <path
            d="M35 20 L65 20"
            fill="none"
            stroke="#6a1b9a"
            strokeWidth="2"
          />
        </g>
      ),
      round_glasses: (
        <g transform="translate(0, 5)">
          <circle cx="43" cy="25" r="5" fill="none" stroke="#c0c0c0" strokeWidth="1" />
          <circle cx="57" cy="25" r="5" fill="none" stroke="#c0c0c0" strokeWidth="1" />
          <line x1="48" y1="25" x2="52" y2="25" stroke="#c0c0c0" strokeWidth="1" />
        </g>
      ),
    };

    return accessoryPaths[accessoryId];
  };

  const renderHandAccessory = (accessoryId: HandAccessory | null) => {
    if (!accessoryId) return null;

    const accessoryPaths: Record<HandAccessory, JSX.Element> = {
      magic_wand: (
        <g transform="translate(65, 45)">
          <path
            d="M0 0 L20 -20"
            stroke="#ffd700"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <animate
              attributeName="stroke-opacity"
              values="1;0.3;1"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      ),
      witch_broom: (
        <g transform="translate(65, 40)">
          <line x1="0" y1="0" x2="20" y2="20" stroke="#8b4513" strokeWidth="2"/>
          <path d="M15 15 L25 25" stroke="#d2691e" strokeWidth="4" strokeLinecap="round"/>
        </g>
      ),
      white_candle: (
        <g transform="translate(65, 45)">
          <rect x="0" y="0" width="4" height="10" fill="#fff"/>
          <line x1="2" y1="0" x2="2" y2="-2" stroke="#ffd700" strokeWidth="1">
            <animate attributeName="stroke-opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite"/>
          </line>
        </g>
      ),
      spellbook: (
        <g transform="translate(65, 45)">
          <rect x="0" y="0" width="15" height="12" fill="#4a148c"/>
          <line x1="0" y1="4" x2="15" y2="4" stroke="#fff" strokeWidth="0.5"/>
          <line x1="0" y1="8" x2="15" y2="8" stroke="#fff" strokeWidth="0.5"/>
        </g>
      ),
      ruby_dagger: (
        <g transform="translate(65, 45)">
          <path d="M0 0 L5 5 L0 20" fill="none" stroke="silver" strokeWidth="1"/>
          <circle cx="0" cy="0" r="2" fill="#ff1744"/>
        </g>
      ),
    };

    return accessoryPaths[accessoryId];
  };

  const renderFamiliar = () => {
    const familiarComponents: Record<FamiliarType, JSX.Element> = {
      bat: (
        <g>
          {/* Corpo */}
          <ellipse cx="50" cy="45" rx="20" ry="15" fill="#6b4e71" stroke="#4a3b4f" strokeWidth="2"/>

          {/* Asas */}
          <path
            d="M20 30 Q35 20 50 35 Q65 20 80 30"
            fill="#6b4e71"
            stroke="#4a3b4f"
            strokeWidth="2"
          />

          {/* Cabeça */}
          <circle cx="50" cy="30" r="12" fill="#6b4e71" stroke="#4a3b4f" strokeWidth="2"/>

          {/* Orelhas */}
          <path d="M42 22 L38 15 L46 18 Z" fill="#6b4e71"/>
          <path d="M58 22 L54 18 L62 15 Z" fill="#6b4e71"/>

          {/* Olhos */}
          <circle cx="45" cy="28" r="2" fill="#fff"/>
          <circle cx="55" cy="28" r="2" fill="#fff"/>
          <circle cx="45" cy="28" r="1" fill="#000"/>
          <circle cx="55" cy="28" r="1" fill="#000"/>

          {/* Pernas */}
          <path d="M40 55 L35 65" stroke="#4a3b4f" strokeWidth="2"/>
          <path d="M60 55 L65 65" stroke="#4a3b4f" strokeWidth="2"/>
        </g>
      ),
      toad: (
        <g>
          {/* Corpo */}
          <ellipse cx="50" cy="50" rx="25" ry="20" fill="#5d8c51" stroke="#3d5c34" strokeWidth="2"/>

          {/* Cabeça */}
          <path
            d="M35 30 Q50 25 65 30 Q65 45 50 40 Q35 45 35 30"
            fill="#5d8c51"
            stroke="#3d5c34"
            strokeWidth="2"
          />

          {/* Olhos */}
          <circle cx="42" cy="32" r="5" fill="#fff" stroke="#3d5c34"/>
          <circle cx="58" cy="32" r="5" fill="#fff" stroke="#3d5c34"/>
          <circle cx="42" cy="32" r="2" fill="#000"/>
          <circle cx="58" cy="32" r="2" fill="#000"/>

          {/* Pernas */}
          <path d="M35 60 Q30 70 25 65" stroke="#3d5c34" strokeWidth="2"/>
          <path d="M65 60 Q70 70 75 65" stroke="#3d5c34" strokeWidth="2"/>
        </g>
      ),
      moth: (
        <g>
          {/* Corpo */}
          <path
            d="M45 35 Q50 30 55 35 L50 55 Z"
            fill="#c4a484"
            stroke="#a88b6a"
            strokeWidth="2"
          />

          {/* Asas */}
          <path
            d="M20 30 Q50 60 80 30"
            fill="#d4b494"
            stroke="#a88b6a"
            strokeWidth="2"
          />

          {/* Cabeça */}
          <circle cx="50" cy="30" r="8" fill="#c4a484" stroke="#a88b6a" strokeWidth="2"/>

          {/* Antenas */}
          <path d="M45 25 Q40 15 35 10" fill="none" stroke="#a88b6a" strokeWidth="2"/>
          <path d="M55 25 Q60 15 65 10" fill="none" stroke="#a88b6a" strokeWidth="2"/>

          {/* Olhos */}
          <circle cx="47" cy="28" r="2" fill="#000"/>
          <circle cx="53" cy="28" r="2" fill="#000"/>
        </g>
      ),
      beetle: (
        <g>
          {/* Corpo */}
          <path
            d="M35 40 Q50 35 65 40 Q65 60 50 55 Q35 60 35 40"
            fill="#2d5a27"
            stroke="#1a3a18"
            strokeWidth="2"
          />

          {/* Cabeça */}
          <circle cx="50" cy="35" r="10" fill="#2d5a27" stroke="#1a3a18" strokeWidth="2"/>

          {/* Asas */}
          <path
            d="M30 40 Q50 20 70 40"
            fill="#1a3a18"
            stroke="#0a1a08"
            strokeWidth="2"
          />

          {/* Pernas */}
          <path d="M35 45 Q30 50 25 45" stroke="#1a3a18" strokeWidth="2"/>
          <path d="M40 50 Q35 55 30 50" stroke="#1a3a18" strokeWidth="2"/>
          <path d="M65 45 Q70 50 75 45" stroke="#1a3a18" strokeWidth="2"/>
          <path d="M60 50 Q65 55 70 50" stroke="#1a3a18" strokeWidth="2"/>

          {/* Olhos */}
          <circle cx="45" cy="33" r="2" fill="#fff"/>
          <circle cx="55" cy="33" r="2" fill="#fff"/>
        </g>
      ),
      cat: (
        <g>
          {/* Corpo */}
          <path
            d="M35 45 Q50 40 65 45 Q65 65 50 60 Q35 65 35 45"
            fill="#8b4513"
            stroke="#5b2d0d"
            strokeWidth="2"
          />

          {/* Cabeça */}
          <path
            d="M35 30 Q50 25 65 30 Q65 45 50 40 Q35 45 35 30"
            fill="#8b4513"
            stroke="#5b2d0d"
            strokeWidth="2"
          />

          {/* Orelhas */}
          <path d="M35 25 L30 15 L40 20 Z" fill="#8b4513" stroke="#5b2d0d"/>
          <path d="M65 25 L60 20 L70 15 Z" fill="#8b4513" stroke="#5b2d0d"/>

          {/* Olhos */}
          <circle cx="43" cy="32" r="3" fill="#fff"/>
          <circle cx="57" cy="32" r="3" fill="#fff"/>
          <ellipse cx="43" cy="32" rx="1.5" ry="3" fill="#000"/>
          <ellipse cx="57" cy="32" rx="1.5" ry="3" fill="#000"/>

          {/* Nariz e Bigodes */}
          <path d="M48 35 L52 35 L50 37 Z" fill="#000"/>
          <path d="M35 35 L45 34" stroke="#5b2d0d" strokeWidth="1"/>
          <path d="M35 36 L45 37" stroke="#5b2d0d" strokeWidth="1"/>
          <path d="M55 34 L65 35" stroke="#5b2d0d" strokeWidth="1"/>
          <path d="M55 37 L65 36" stroke="#5b2d0d" strokeWidth="1"/>

          {/* Pernas */}
          <path d="M40 60 L35 70" stroke="#5b2d0d" strokeWidth="2"/>
          <path d="M60 60 L65 70" stroke="#5b2d0d" strokeWidth="2"/>
        </g>
      ),
      dog: (
        <g>
          {/* Corpo */}
          <path
            d="M35 45 Q50 40 65 45 Q65 65 50 60 Q35 65 35 45"
            fill="#8b4513"
            stroke="#5b2d0d"
            strokeWidth="2"
          />

          {/* Cabeça */}
          <path
            d="M35 30 Q50 25 65 30 Q65 45 50 40 Q35 45 35 30"
            fill="#8b4513"
            stroke="#5b2d0d"
            strokeWidth="2"
          />

          {/* Orelhas */}
          <path
            d="M35 25 Q30 15 40 20"
            fill="#8b4513"
            stroke="#5b2d0d"
            strokeWidth="2"
          />
          <path
            d="M65 25 Q70 15 60 20"
            fill="#8b4513"
            stroke="#5b2d0d"
            strokeWidth="2"
          />

          {/* Olhos */}
          <circle cx="43" cy="32" r="3" fill="#fff"/>
          <circle cx="57" cy="32" r="3" fill="#fff"/>
          <circle cx="43" cy="32" r="1.5" fill="#000"/>
          <circle cx="57" cy="32" r="1.5" fill="#000"/>

          {/* Nariz e Boca */}
          <circle cx="50" cy="35" r="2" fill="#000"/>
          <path
            d="M50 37 Q50 40 53 40"
            fill="none"
            stroke="#5b2d0d"
            strokeWidth="1.5"
          />

          {/* Pernas */}
          <path d="M40 60 L35 70" stroke="#5b2d0d" strokeWidth="2"/>
          <path d="M60 60 L65 70" stroke="#5b2d0d" strokeWidth="2"/>
        </g>
      ),
      goat: (
        <g>
          {/* Corpo */}
          <path
            d="M35 45 Q50 40 65 45 Q65 65 50 60 Q35 65 35 45"
            fill="#d3d3d3"
            stroke="#a9a9a9"
            strokeWidth="2"
          />

          {/* Cabeça */}
          <path
            d="M35 30 Q50 25 65 30 Q65 45 50 40 Q35 45 35 30"
            fill="#d3d3d3"
            stroke="#a9a9a9"
            strokeWidth="2"
          />

          {/* Chifres */}
          <path
            d="M40 25 C35 15 45 10 40 25"
            fill="#a9a9a9"
            stroke="#808080"
            strokeWidth="2"
          />
          <path
            d="M60 25 C65 15 55 10 60 25"
            fill="#a9a9a9"
            stroke="#808080"
            strokeWidth="2"
          />

          {/* Olhos */}
          <circle cx="43" cy="32" r="3" fill="#fff"/>
          <circle cx="57" cy="32" r="3" fill="#fff"/>
          <circle cx="43" cy="32" r="1.5" fill="#000"/>
          <circle cx="57" cy="32" r="1.5" fill="#000"/>

          {/* Barba */}
          <path d="M45 40 Q50 45 55 40" stroke="#a9a9a9" strokeWidth="1.5"/>
          <path d="M48 40 L48 45" stroke="#a9a9a9" strokeWidth="1.5"/>
          <path d="M52 40 L52 45" stroke="#a9a9a9" strokeWidth="1.5"/>

          {/* Pernas */}
          <path d="M40 60 L35 70" stroke="#a9a9a9" strokeWidth="2"/>
          <path d="M60 60 L65 70" stroke="#a9a9a9" strokeWidth="2"/>
        </g>
      ),
    };

    return familiarComponents[appearance.race];
  };

  return (
    <motion.div
      className="fixed bottom-4 right-4 w-24 h-24 cursor-pointer"
      whileHover={{ scale: 1.1 }}
      animate={isAnimating ? {
        y: [0, -10, 0],
        transition: { duration: 2, repeat: Infinity }
      } : {}}
      onClick={handleClick}
    >
      <div className="relative w-full h-full">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
        >
          {/* Base do familiar */}
          <g key={appearance.race}>
            {renderFamiliar()}
          </g>

          {/* Acessórios do corpo */}
          {renderBodyAccessories(appearance.accessories?.body || [])}

          {/* Acessório da cabeça */}
          {renderHeadAccessory(appearance.accessories?.head)}

          {/* Acessório da mão */}
          {renderHandAccessory(appearance.accessories?.hand)}

          {/* Efeitos mágicos */}
          <g className="magic-effects">
            <circle
              cx="50"
              cy="45"
              r="40"
              fill="url(#magicGlow)"
              opacity="0.3"
            >
              <animate
                attributeName="opacity"
                values="0.3;0.1;0.3"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
          </g>

          {/* Gradientes e efeitos */}
          <defs>
            <radialGradient id="magicGlow">
              <stop offset="0%" stopColor="#b388ff" />
              <stop offset="100%" stopColor="#7c4dff" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>

        {/* Onomatopeia */}
        {showSound && (
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: -20 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 right-0 transform -translate-y-full bg-purple-900/80 px-2 py-1 rounded text-xs text-white whitespace-nowrap"
          >
            {FAMILIAR_SOUNDS[appearance.race]}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}