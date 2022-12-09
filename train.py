import os

from trainer import Trainer, TrainerArgs

from TTS.TTS.tts.configs.glow_tts_config import GlowTTSConfig

from TTS.TTS.tts.configs.shared_configs import BaseDatasetConfig
from TTS.TTS.tts.datasets import load_tts_samples
from TTS.TTS.tts.models.glow_tts import GlowTTS
from TTS.TTS.tts.utils.text.tokenizer import TTSTokenizer
from TTS.TTS.utils.audio import AudioProcessor

output_path = os.path.dirname(os.path.abspath(__file__)).split(".")[0]+"\\trainset"
